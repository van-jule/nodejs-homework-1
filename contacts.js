const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const chalk = require("chalk");

const readContent = async () => {
  const contactsPath = await fs.readFile(
    path.join(__dirname, "db", "contacts.json"),
    "utf8"
  );
  const result = JSON.parse(contactsPath);
  return result;
};

const listContacts = async () => {
  return await readContent();
};

const getContactById = async (contactId) => {
  const contacts = await readContent();
  const [result] = contacts.find((contact) => contact.id === contactId);
  return result;
};

const removeContact = async (contactId) => {
  const contacts = await readContent();
  const result = contacts.filter((contact) => contact.id !== contactId);
  await fs.writeFile(
    path.join(__dirname, "db", "contacts.json"),
    JSON.stringify(result, null, 2)
  );
  return result;
};

const addContact = async (name, email, phone) => {
  const contacts = await readContent();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  const warning = chalk.redBright.bold;

  if (newContact.name && newContact.phone && newContact.email) {
    if (contacts.find(({ name }) => name === newContact.name)) {
      console.log(
        warning(`${newContact.name} is already in contacts. If these are different persons, please change the name to a unique one and save again
      `)
      );
      return;
    }

    if (contacts.find(({ email }) => email === newContact.email)) {
      console.log(
        warning(
          `This email ${newContact.email} is listed with the person ${newContact.name}.`
        )
      );
      return;
    }

    if (contacts.find(({ phone }) => phone === newContact.phone)) {
      console.log(
        warning(
          `This phone ${newContact.phone} is listed with the person ${newContact.name}.`
        )
      );
      return;
    }

    contacts.push(newContact);
    await fs.writeFile(
      path.join(__dirname, "db", "contacts.json"),
      JSON.stringify(contacts, null, 2)
    );

    console.log(newContact);
    console.log(
      chalk.underline.blue(`Contact ${newContact.name} was added to the list`)
    );
    console.table(contacts);

    return newContact;
  } else {
    console.log(
      warning("Enter, please, contact name, email and phone. Thank you")
    );
  }
};

module.exports = { listContacts, getContactById, removeContact, addContact };
