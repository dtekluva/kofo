import smtplib

try:
    sender = 'inyangete@gmail.com'
    receiver = 'inyangete@gmail.com'
    server  = smtplib.SMTP('smtp.gmail.com',587)
    server.starttls()
    server.login(sender, "19sedimat54")

    message = "Hi there, I am sending this email from python"
    server.sendmail(sender, receiver, message)
    server.quit()
    print('sent mail successfully')
except:
    print("Unable to send email due to network")