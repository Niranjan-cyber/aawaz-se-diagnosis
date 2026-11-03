import os

from sarvamai import SarvamAI

# Reads SARVAM_API_KEY from the environment (load .env with: python -m dotenv run -- python main.py,
# or set it in your shell). Here we parse .env manually to avoid extra dependencies.
if os.path.exists(".env"):
    for line in open(".env", encoding="utf-8"):
        k, _, v = line.strip().partition("=")
        if k and v and k not in os.environ:
            os.environ[k] = v

client = SarvamAI(api_subscription_key=os.environ["SARVAM_API_KEY"])

response = client.chat.completions(
    model="sarvam-105b-conversations",
    messages=[{"role": "user", "content": "Say hello in Hindi and English."}],
)
print(response.choices[0].message.content)
