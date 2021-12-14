const chalk = require("chalk");
const { Command } = require("commander");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts");

const program = new Command();

program
  .requiredOption("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

const invokeAction = async ({ action, id, name, email, phone }) => {
  const contactsList = await listContacts();

  switch (action) {
    case "list":
      console.table(contactsList);
      break;

    case "get":
      const contactById = await getContactById(id);
      if (contactById) {
        console.log(chalk.green("Contact found"));
        console.log(contactById);
        return;
      }
      console.log(chalk.red("Contact not found"));

      break;

    case "add":
      await addContact(name, email, phone);
      break;

    case "remove":
      const updatedContacts = await removeContact(id);

      if (updatedContacts.length === contactsList.length) {
        console.log(chalk.red.bold(`Contact with id "${id}" not found`));
        return;
      }
      console.log(chalk.green.bold(`Contact with id "${id}" removed`));
      console.table(updatedContacts);

      break;

    default:
      console.warn(chalk.red("\x1B[31m Unknown action type!"));
  }
};

invokeAction(argv).then(() => console.log("Operation successful"));
