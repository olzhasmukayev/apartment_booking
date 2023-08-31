from fastapi import FastAPI, Response, BackgroundTasks
from starlette.middleware.cors import CORSMiddleware
import asyncio
from app.utils import AppModel
from app.auth.router import router as auth_router
from app.shanyraks.router import router as shanyraks_router
from app.parsing.router import router as parsing_router
from app.chat.router import router as chat_router
from app.config import client, env, fastapi_config
from app.tweets.router import router as tweets_router
from app.chat.router.router_update_all import bg_task
from app.chat.service import Service, get_service
from notifications.tasks import send_notification
from notifications.schemas import NotificationRequest
import re
from dotenv import load_dotenv

app = FastAPI(**fastapi_config)

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import TextLoader
from fastapi import FastAPI, Request
import dotenv
dotenv.load_dotenv()
from pathlib import Path
from app.auth.adapters.jwt_service import JWTData
from app.auth.router.dependencies import parse_jwt_user_data


import os
import sys
import time


load_dotenv()
root_path = os.path.dirname(os.path.realpath(__file__))


class BackgroundRunner:
    async def run_main(self):
        while True:
            svc = get_service()
            await bg_task(svc)


runner = BackgroundRunner()


@app.on_event("startup")
async def update_all() -> dict[str, str]:
    asyncio.create_task(runner.run_main())


@app.on_event("shutdown")
def shutdown_db_client():
    client.close()


app.add_middleware(
    CORSMiddleware,
    allow_origins=env.CORS_ORIGINS,
    allow_methods=env.CORS_METHODS,
    allow_headers=env.CORS_HEADERS,
    allow_credentials=True,
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(tweets_router, prefix="/favorites", tags=["Favorites"])
app.include_router(shanyraks_router, prefix="/shanyraks", tags=["Shanyraks"])
app.include_router(parsing_router, prefix="/parse", tags=["Parsing"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])

openai_api_key = os.getenv("OPENAI_API_KEY")


def extract_chunks_from_pdf(file_path):
    loader = PyPDFLoader(file_path)
    return loader.load()


def extract_chunks_from_txt(file_path):
    loader = TextLoader(file_path, encoding="utf-8")
    return loader.load()


def load_chunks_to_doc(folder_name):
    documents = []
    for file in os.listdir(folder_name):
        file_path = f"{folder_name}/{file}"

        if file.endswith('.pdf'):
            documents.extend(extract_chunks_from_pdf(file_path))
        elif file.endswith('.txt'):
            documents.extend(extract_chunks_from_txt(file_path))
    return documents


def split_chunks_into_documents():
    documents = load_chunks_to_doc(root_path + "/docs")
    chunk_size = 1000
    chunk_overlap = 200

    # Recursive -> "\n\n" -> "\n" -> " "
    text_splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunked_documents = text_splitter.split_documents(documents)
    return chunked_documents


def generate_index_from_documents():
    persist_directory = root_path + '/db'

    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
    if os.path.exists(persist_directory):
        return Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    else:
        docs = split_chunks_into_documents()
        db = Chroma.from_documents(docs, embeddings, persist_directory=persist_directory)
        db.persist()
        return db


def generate_context_from_documents(query):
    db = generate_index_from_documents()
    docs = db.similarity_search(query, 50)
    context = [i.page_content for i in docs]
    return context


class SearchRequest(AppModel):
    query: str

@app.post("/context")
async def get_context(
    input: SearchRequest
):
    pattern = r"Номер:\s(\d+)"
    numbers = []
    context = generate_context_from_documents(input.query)
    for val in context:
        match = re.search(pattern, val)
        if match:
            numbers.append(match.group(1))

    return {"flats": list(dict.fromkeys(numbers))}


@app.post("/book-apartment/")
async def book_apartment(notification: NotificationRequest):
    recipients = [os.environ.get("BOOKING_NOTIFICATION_EMAIL")]
    message = f"Apartment booked: {notification.message}"
    
    task_results = []

    for recipient in recipients:
        task_result = send_notification.delay(
            "email", recipient, message
        )
        task_results.append({"recipient": recipient, "task_id": task_result.id})

    return {"message": "Apartment booked", "notification_tasks": task_results}