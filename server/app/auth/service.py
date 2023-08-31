from pydantic import BaseSettings

from app.config import database

from .adapters.jwt_service import JwtService
from .repository.repository import AuthRepository


class AuthConfig(BaseSettings):
    JWT_ALG: str = "HS256"
    JWT_SECRET: str = "MIICXAIBAAKBgQClVgg96m3RtHoP/oGuf1CmdeBbKiG7ftojwFh981tF5HvXDcZYxTz43MpRm3zYuWCcbZZT3w+cXxVrpvvXFE0BPS1T+Ov7VZSPECLnRhPRvd5OjkkgeZCGoGmDJwlxRYhnGJZjbCQHCz/7bKq5CciLyzTKuv8+neYgP7KC2khoQQIDAQABAoGAUEe77MR92ot1kXqU4XP0Zz9pVxrYEkCAD0gAL/gQY5mUAFIx8zyiZHxgyMtlDZ7FqG8VxVfULquErScBteenk5zUG2iPnao/tIVMkUHPHvehAIZ5zA8VwkQo2uuAzU6Se5FLbwbRl9e6kYUiFee4IhUVCXhHGe9aA8DQrD91daECQQD6CPnnYJq6dlb2W9teo9m9IE6nueHyLj3kP2Tqa2KiwZG4/udpsdBzqEUk7+z8vZ/eNPlZ/z7EZr8N/3S1tBV1AkEAqUfHbGjhMbylb9Tc51Jbm2DrrinLsOVzb+xn/Pg3WOlYJpAADdUgTC2HAvuALKiA8/kexmAVjPnwyUZxTSjSHQJBAJVlA5yCFjFPQAqXO+3CTPk58oU5BY3kn0pfrnZ6j0bcDavRcoeunPReGGJHkPw6eOkWEd76KZDEK2e7uQpQfXkCQFHx4lLTbnfyNy+snocIMjpEL7KunuDyIfCDQ0+NJNXQl5CLUstfaXQW8e16q/ByXYI9DS3Ao44MDAiTJhPQ9+0CQD/GKRmFODc4cO6Iv69viQ9aWVW5Ps+TT8cpubFKl4W/7pY0aegXhWzv/jwFUhdYVW1XQDw5zxhIuvSruWxvpsY"
    JWT_SECRET_REF: str = "MIICWgIBAAKBgFkY97IA3+Q8Xm3zSJriYLreBCkz/P8QgMgqVWqQKoPpgs12e9ccYwqd9FDQRX2bCb64o4udjOS1nh/fRhIBcsUQ+6TFeCMdUwctTz2YJ4vc/b+u8a44U8BeeXCUaVmr/LPrL0UUPGSddWilh6YcHoHz+A9eUK+2ArGVpza21eSFAgMBAAECgYA4vMOPYSsyZpcjoVdM+nfqx9MSgf7MVrALx5mZQLEyS5N2T8tREsynSCr7A4YdFIvCHkZXdD7yrg1B8qbmdHGm9rNCrY0LoumF6VTCm8/GwM6pnxYbOZ4nnbtkBcKx+NxVZ80p2mWTkXfPi0HHsZN5VnnRwx6endg7KAI+819miQJBAKyufp0zPQ1t6Y8bZ/qGYmT5eZVXXCk/R1zdIhocKMSEjcaxq0H/80CiHZc1noFTCrLnvLXtF3WizojVYtIU2gcCQQCEFjpufm3b2KVr4vaHGlGrBOJ1naSvzyM9fEBWdjeqqpgWqTEaUKxalYdry7ljARWcsApxCF7FsAdcxmZwcxoTAkBoy/lBM+Bgbwzocax3yOib+R9Fd+ARlDqd7AIPMHm5Ueys4hRaGJgq6Hfm1X6dY6VBkAvhqMKs/KI1PrMbZdYvAkBj53AgnK25J97OgCcYvrZglNw4O5kRhKlR2wXKn7Ww90D7etLx5WzHQuvfg4JfuLVBAwGSxtLv0RlweXuHt/dTAkBWUvVqfo3MNOQUzH9INlXCvwE2tpSyKBIvEOc5W3kv9xyKszpbnl/WHM8fpah2YB2M6rUbAYqX1JgteI7qwKy5"
    JWT_EXP_ACC: int = 1000
    JWT_EXP_REF: int = 1000


config = AuthConfig()


class Service:
    def __init__(
        self,
        repository: AuthRepository,
        jwt_svc: JwtService,
    ):
        self.repository = repository
        self.jwt_svc = jwt_svc


def get_service():
    repository = AuthRepository(database)
    jwt_svc = JwtService(
        config.JWT_ALG,
        config.JWT_SECRET,
        config.JWT_SECRET_REF,
        config.JWT_EXP_ACC,
        config.JWT_EXP_REF,
    )

    svc = Service(repository, jwt_svc)
    return svc
