const fs = require("fs-extra");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "Efat",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands",
    },
    longDescription: {
      en: "View detailed command usage and see the full list of commands available.",
    },
    category: "info",
    guide: {
      en: "{pn} / help [command name]",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const threadData = await threadsData.get(threadID);

    const imageUrl = "https://i.ibb.co/VwJkHhX/efat-help.jpg"; // Final image for all responses
    let attachment = null;
    try {
      attachment = await global.utils.getStreamFromURL(imageUrl);
    } catch (e) {
      console.error("Image fetch error:", e.message);
    }

    if (args.length === 0) {
      const categories = {};
      let msg = "╭───────❁";
      msg += `\n│ 𝗘𝗙𝗔𝗧 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨\n╰────────────❁`;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭─────✰『 ${category.toUpperCase()} 』`;
          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map(item => `⭔${item}`);
            msg += `\n│ ${cmds.join("   ")}`;
          }
          msg += `\n╰────────────✰`;
        }
      });

      msg += `\n\n╭─────✰[INFO]
│ > TOTAL COMMANDS: ${commands.size}
│ > TYPE: ${prefix}help [command]
╰────────────✰`;

      msg += `\n╭─────✰\n│ Powered by: 𝗘𝗙𝗔𝗧\n╰────────────✰`;

      return message.reply({ body: msg, attachment });
    }

    // Specific command info
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!command) {
      return message.reply(`Command "${commandName}" not found.`);
    }

    const config = command.config;
    const roleText = roleTextToString(config.role);
    const author = config.author || "Unknown";
    const description = config.longDescription?.en || "No description available.";
    const usage = config.guide?.en?.replace(/{p}/g, prefix).replace(/{n}/g, config.name) || "No usage guide.";

    const replyMsg = `
╭───⊙
│ 🔶 ${config.name}
├── INFO
│ 📝 Description: ${description}
│ 👤 Author: ${author}
│ ⚙ Guide: ${usage}
├── USAGE
│ 🔯 Version: ${config.version || "1.0"}
│ ♻ Role: ${roleText}
╰────────────⊙`;

    return message.reply({ body: replyMsg, attachment });
  },
};

function roleTextToString(role) {
  switch (role) {
    case 0: return "0 (All users)";
    case 1: return "1 (Group admins)";
    case 2: return "2 (Bot admins)";
    default: return "Unknown";
  }
}
