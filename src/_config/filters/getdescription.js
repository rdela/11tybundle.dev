import EleventyFetch from "@11ty/eleventy-fetch";
import * as cheerio from "cheerio";

let descriptionCache = {};

// getDescription - given a url, this Eleventy filter extracts the meta
// description from within the <head> element of a web page using the cheerio
// library.
//
// The full html content of the page is fetched using the eleventy-fetch plugin.
// If you have a lot of links from which you want to extract descriptions, the
// initial build time will be slow. However, the plugin will cache the content
// for a duration of your choosing (in this case, it's set to *, which will
// never fetch new data after the first success).
//
// The description is extracted from the <meta> element with the name attribute
// of "description".
//
// If no description is found, the filter returns an empty string. In the event
// of an error, the filter logs an error to the console and returns the string
// "(no description available)"
//
// Note that I have a .cache folder in my project root and added .cache to my
// .gitignore file. See https://www.11ty.dev/docs/plugins/fetch/#installation
export const getDescription = async (link) => {
  // Check if the description is in the cache
  if (descriptionCache[link]) {
    return descriptionCache[link];
  }
  if (link.includes("youtube.com")) {
    descriptionCache[link] = "YouTube video";
    return descriptionCache[link];
  }
  if (link.includes("medium.com")) {
    descriptionCache[link] = "Medium post";
    return descriptionCache[link];
  }
  try {
    let htmlcontent = await EleventyFetch(link, {
      directory: ".cache",
      duration: "*",
      type: "buffer",
    });
    const $ = cheerio.load(htmlcontent);
    const description = $("meta[name=description]").attr("content");
    if (description == undefined) {
      descriptionCache[link] = "";
    } else {
      descriptionCache[link] = description.replace(/[<>]/g, "").trim();
    }
    return descriptionCache[link];
  } catch (e) {
    // console.log("Error fetching description for " + link + " " + e.message);
    console.log("Error fetching description for " + link);
    return "";
  }
};
