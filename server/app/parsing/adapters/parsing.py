from bs4 import BeautifulSoup
import requests
import re
import json
import codecs


class ParseService:
    def __init__() -> None:
        pass

    def parse_data(page):
        result = []
        url = f'https://krisha.kz/arenda/kvartiry/?page={page + 1}'
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        appartament_tags = soup.find_all('div', class_="a-card")
        for appartament_tag in appartament_tags:
            flat_id = appartament_tag.get('data-id')
            flat_reponse = requests.get(f"https://m.krisha.kz/a/show/{flat_id}")
            flat = BeautifulSoup(flat_reponse.content, 'html.parser')
            outer_div = flat.find('div', class_='offer__advert-info')
            coherent_text = ""

            for div in outer_div.find_all('div', class_='offer__info-item'):
                text = div.get_text().replace('\n', ' ').strip()
                coherent_text += text + ". "

            coherent_text = re.sub(r'\s+', ' ', coherent_text)

            coherent_text += '. '

            def extract_text_with_spaces(element):
                text = ""
                if element.name is None:
                    # Handle text elements
                    text = element.strip()
                elif element.name == "dl":
                    # Handle <dl> tags and their children with spaces
                    dt = element.dt.get_text(strip=True)
                    dd = element.dd.get_text(strip=True)
                    text = f" {dt} - {dd},"
                else:
                    # Handle other tags and their children recursively
                    for child in element.children:
                        text += extract_text_with_spaces(child)
                    if element.name == "div":
                        text += " "  # Add space for divs
                return text

            offer_description = flat.find('div', class_='offer__description')

            coherent_text_2 = extract_text_with_spaces(offer_description)

            # Remove multiple spaces in a row and keep only one space
            coherent_text_2 = re.sub(r'\s+', ' ', coherent_text_2)

            coherent_text += " " + coherent_text_2.strip()

            def extract_img_src_from_div(soup, container_class):
                img_src_list = []

                # Find all divs with the given class, including nested ones
                divs = soup.find_all('div', class_=container_class)

                for div in divs:
                    img_tags = div.find_all('img')
                    img_src_list.extend(img.get('src') for img in img_tags if img.get('src') and img.get('src').startswith("https:"))

                return img_src_list

            src_array = extract_img_src_from_div(flat, "gallery__container")

            images_updated = [img.replace("120x90", "750x470") for img in src_array]

            # get rest data
            url_other = f"https://m.krisha.kz/analytics/aPriceAnalysis/?id={flat_id}"
            response = requests.get(url_other)
            appartament = {}
            if response.status_code == 200:
                data = response.json()
                appartament["flat_id"] = flat_id
                appartament["price"] = ''.join(re.findall(r'\d+', data['advert']['price']))
                appartament["address"] = data['advert']['fullAddress']
                appartament["title"] = data['advert']['title']
                appartament["description"] = coherent_text
                appartament["images"] = images_updated
            result.append(appartament)
        return result
