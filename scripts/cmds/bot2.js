const axios = require("axios");

module.exports.config = {
  name: "efu",
  version: "1.0",
  role: 2,
  author: "efat",
  description: "Generate images with Pollinations API",
  category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  preimum: true,
  guide: "{pn} [prompt] --ratio 1024x1024\n{pn} [prompt]",
  countDown: 15,
};

module.exports.onStart = async ({ message, event, args, api }) => {
  try {
    const prompt = args.join(" ");
    const startTime = new Date().getTime();

    // Send initial message to inform the user that the image generation is in process
    const ok = await message.reply('Wait a moment... <😘>');

    // Set loading emoji
    api.setMessageReaction("⌛", event.messageID, (err) => {}, true);

    // Pollinations API URL with the user's prompt
    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    // Set completion emoji
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);

    // Unsend initial message and send image
    message.unsend(ok.messageID);

    // Fetch image from Pollinations API
    const attachment = await global.utils.getStreamFromURL(apiUrl);
    const endTime = new Date().getTime();

    // Send the generated image with time taken
    await message.reply({
      body: `Here's your image\nModel Name: "Pollinations API"\nTime Taken: ${(endTime - startTime) / 1000} second/s`, 
      attachment,
    });
  } catch (e) {
    console.error(e);
    message.reply("Error: " + e.message);
  }
};
