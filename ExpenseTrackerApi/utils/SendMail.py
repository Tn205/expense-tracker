from fastapi import FastAPI
import smtplib 
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = "nayanrabadiya1313@gmail.com"
SMTP_PASSWORD = "llat osdt uxbb apxo"

def send_email(to_email:str, subject:str, text:str):
    msg = MIMEMultipart()
    msg['From'] = SMTP_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(text, 'plain'))
    
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(SMTP_EMAIL, SMTP_PASSWORD)
    server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
    server.quit()
    
    return {"message": "Email sent successfully"}

# send_email("nayanrabadiya12@gmail.com","Account created successfully","Your account has been created successfully")