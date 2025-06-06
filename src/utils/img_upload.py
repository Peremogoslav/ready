import requests

IMGBB_API_KEY = "d4d6c58e63d037d9c2af5e11cb51db2e"

def upload_image_to_imgbb(image_bytes: bytes) -> str:
    url = "https://api.imgbb.com/1/upload"
    payload = {
        "key": IMGBB_API_KEY,
        "image": image_bytes.encode("base64") if hasattr(image_bytes, "encode") else image_bytes,
    }
    response = requests.post(url, files={"image": image_bytes}, data={"key": IMGBB_API_KEY})
    if response.status_code == 200:
        json_response = response.json()
        return json_response["data"]["url"]
    else:
        raise Exception("Failed to upload image to imgbb")
