document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Clear previous error message
  document.querySelector('#compose-error').innerHTML = "";

  // Call the submit_email function when form is submitted
  document.querySelector('#compose-form').onsubmit = submit_email;
}

function submit_email(event){
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;


    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(result => {
      if (result.error){
        document.querySelector('#compose-error').innerHTML = result.error;
      }
      else{
        load_mailbox('sent');
      }
    })
    .catch(error => {
      document.querySelector('#compose-error').innerHTML = "Something went wrong";
      console.log(error);
    });
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {

    const emailContainer = document.createElement('div');
    emailContainer.classList.add('container-lg', 'ms-3', 'mt-3');

    document.querySelector("#emails-view").append(emailContainer);
    
    const emailList = document.createElement('div');
    emailContainer.appendChild(emailList);
    emailList.classList.add('list-group');


    emails.forEach(email => {

      const emailItem = document.createElement('div');
      emailItem.classList.add('list-group-item', 'd-flex', 'flex-column', 'mt-3', 'divhover');
      emailList.appendChild(emailItem);

      emailItem.addEventListener('click', () => {
        
      })

      if (mailbox === "inbox" && !email.read) {
          emailItem.classList.add("unreadColor");
      }

      const fromElm = document.createElement('div');
      emailItem.appendChild(fromElm);
      fromElm.innerHTML = "From: " + email.sender;

      const subTimeElm = document.createElement('div');
      subTimeElm.classList.add('d-flex', 'flex-column', 'flex-md-row', 'justify-content-between')
      emailItem.appendChild(subTimeElm);

      const subjectElm = document.createElement('div');
      subTimeElm.appendChild(subjectElm);
      subjectElm.innerHTML = "Subject: " + email.subject;

      const timeElm = document.createElement('div');
      timeElm.classList.add('textmuted', 'small');
      subTimeElm.appendChild(timeElm);
      timeElm.innerHTML = email.timestamp;

    });
  });
}

function read_mail(email){

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#email-view').innerHTML = "";
  
}