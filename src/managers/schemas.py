from typing import Optional

from pydantic import BaseModel


class TelegramOnlyOut(BaseModel):
    global_telegram: Optional[str]

    class Config:
        orm_mode = True


class WhatsappOnlyOut(BaseModel):
    global_whatsapp: Optional[str]

    class Config:
        orm_mode = True