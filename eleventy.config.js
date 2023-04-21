module.exports = function (eleventyConfig) {
  //
  // Set up file and directory passthroughs
  //
  [
    "src/assets/audio/",
    { "src/assets/favicon/*": "/" },
    "src/assets/img/",
    "src/robots.txt",
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));

  // Add shortcodes
  //
  //  - eleventy image
  //  - current year
  //
  eleventyConfig.addNunjucksAsyncShortcode(
    "image",
    require("./src/eleventy.config.image.js")
  );

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Add filters
  //
  //  - generate reading time for a post
  //  - format the post date
  //  - return all the tags used in a collection
  //  - filter the post tag list to exclude a few collections
  //  - minify css for inline use
  //  - node inspection utility for debugging
  //  - extract items from the Airtable data that forms the basis of the 11ty Bundle
  //
  eleventyConfig.addFilter(
    "readingTime",
    require("./src/_includes/filters/readingtime.js")
  );

  eleventyConfig.addFilter("formatPostDate", function formatPostDate(date) {
    const { DateTime } = require("luxon");
    return DateTime.fromJSDate(date, { zone: "utc" }).toLocaleString(
      DateTime.DATE_MED
    );
  });

  eleventyConfig.addFilter("formatItemDate", function formatItemDate(date) {
    const { DateTime } = require("luxon");
    const itemDate = Date.parse(date);
    return DateTime.fromMillis(itemDate, { zone: "utc" }).toLocaleString(
      DateTime.DATE_MED
    );
  });

  eleventyConfig.addFilter("getAllTags", (collection) => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
    );
  });

  // Extract releases, blog posts, and site items from Airtable data.
  // Data is returned in descending date order.
  // Data is extracted by Issue and Type
  // The accepted values for Issue are:
  //  0 - items from all issues
  //  issue number - for from a specific issue
  // The accepted values for Type are:
  //   "Release", "Blog post", and "Site"
  eleventyConfig.addFilter(
    "getBundleItems",
    function getBundleItems(bundleitems, bundleIssue, itemType) {
      return bundleitems
        .filter(
          (item) =>
            (bundleIssue == item["Issue"] && itemType == item["Type"]) ||
            (bundleIssue === 0 && itemType == item["Type"])
        )
        .sort((a, b) => {
          return a.Date > b.Date ? -1 : 1;
        });
    }
  );

  // Extract a list of the categories assigned to the selected link.
  // These are appended to each blog post item in the Bundle.
  eleventyConfig.addFilter("getItemCategories", (bundleitems, link) => {
    // console.log("link: " + link);
    // const thisitem = bundleitems.filter((item) => item.Link == link);
    // console.log("thisitem isArray?: " + Array.isArray(thisitem));
    return bundleitems.filter((item) => item.Link == link);
  });

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
  //
  const EleventyFetch = require("@11ty/eleventy-fetch");
  const cheerio = require("cheerio");
  eleventyConfig.addFilter(
    "getDescription",
    async function getDescription(link) {
      try {
        let htmlcontent = await EleventyFetch(link, {
          duration: "*",
          type: "buffer",
        });
        const $ = cheerio.load(htmlcontent);
        // console.log(
        //   "description: " + $("meta[name=description]").attr("content")
        // );
        const description = $("meta[name=description]").attr("content");
        // console.log("link: " + link);
        // console.log("type of link: " + typeof link);
        if (link.includes("youtube.com") || description == undefined) {
          return "YouTube video";
        } else {
          return description;
        }
      } catch (e) {
        console.log(
          "Error fetching description for " + link + ": " + e.message
        );
        return "";
      }
    }
  );

  // Extract a list of the unique categories used in all of the issues
  // of The 11ty Bundle from Airtable data. Items are sorted alphabetically.
  eleventyConfig.addFilter("getBundleCategories", (collection) => {
    let categorySet = new Set();
    for (let item of collection) {
      (item.Categories || []).forEach((category) => categorySet.add(category));
    }
    return Array.from(categorySet).sort((a, b) => {
      return a > b ? 1 : -1;
    });
  });

  // Extract a list of the unique categories used in all of the issues
  // of The 11ty Bundle from Airtable data. Items are sorted alphabetically.
  eleventyConfig.addFilter("getCategoriesAndCounts", (collection) => {
    let categoryMap = new Map();
    for (let item of collection) {
      (item.Categories || []).forEach((category) =>
        categoryMap.set(category, categoryMap.get(category) + 1 || 1)
      );
    }
    return Array.from(categoryMap).sort((a, b) => {
      return a[0] > b[0] ? 1 : -1;
    });
  });

  // Extract a list of the unique blog post authors used in all of the issues
  // of The 11ty Bundle from Airtable data. Authors are sorted alphabetically
  // by first name.
  //
  // AS OF NOW, THIS IS NO LONGER NEEDED AS IT HAS BEEN REPLACED WITH
  // getAuthorsAndCounts, WHICH ALSO RETURNS A COUNT OF THE NUMBER OF POSTS
  // BY EACH AUTHOR.
  //
  // eleventyConfig.addFilter("getBundleAuthors", (collection) => {
  //   let authorSet = new Set();
  //   for (let item of collection) {
  //     if (item.Author && item.Type == "blog post") {
  //       authorSet.add(item.Author);
  //     }
  //   }
  //   return Array.from(authorSet).sort((a, b) => {
  //     return a > b ? 1 : -1;
  //   });
  // });

  // Extract a list of the unique blog post authors used in all of the issues
  // of The 11ty Bundle from Airtable data along with a count of their posts.
  // Authors are sorted alphabetically by first name.
  eleventyConfig.addFilter("getAuthorsAndCounts", (collection) => {
    const authorMap = new Map();
    for (let item of collection) {
      if (item.Author && item.Type == "blog post") {
        authorMap.set(item.Author, authorMap.get(item.Author) + 1 || 1);
      }
    }
    return Array.from(authorMap).sort((a, b) => {
      return a[0] > b[0] ? 1 : -1;
    });
  });

  // Get all 11ty Bundle (Airtable) blog posts for a specific category
  eleventyConfig.addFilter(
    "postsInCategory",
    function postsInCategory(bundleitems, category) {
      // console.log("category typeof: " + typeof category);
      // console.log("category: " + category);
      function postInCategory(item) {
        // console.log("item.Link: " + item.Link);
        // console.log("typeof item: " + typeof item);
        // console.log("typeof item.Type: " + typeof item.Type);
        // console.log("item.Type: " + item.Type);
        if (item.Categories) {
          return item.Type == "blog post" && item.Categories.includes(category)
            ? true
            : false;
        } else {
          if (item.Type == "blog post") {
            console.log(
              "Error: blog post entry has no categories: " + item.Link
            );
            return false;
          }
        }
      }
      return bundleitems.filter(postInCategory).sort((a, b) => {
        return a.Date > b.Date ? -1 : 1;
      });
    }
  );

  // Get all 11ty Bundle (Airtable) blog posts by a specific author
  eleventyConfig.addFilter(
    "postsByAuthor",
    function postsbyAuthor(bundleitems, author) {
      return bundleitems
        .filter((item) => item.Type === "blog post" && item.Author === author)
        .sort((a, b) => {
          return a.Date > b.Date ? -1 : 1;
        });
    }
  );

  const inspect = require("node:util").inspect;
  eleventyConfig.addFilter("inspect", function (obj = {}) {
    return inspect(obj, { sorted: true });
  });

  eleventyConfig.setQuietMode(true);

  // Add plugins
  //
  //  - syntax highlighting
  //  - RSS feed generation
  //  - have eleventy process sass and post-process with lightning
  //  - support for 'draft: true' in template frontmatter
  //  - directory output to show at build time
  //  - eleventy bundle plugin for CSS (and JS and more)
  //
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight);

  const pluginRss = require("@11ty/eleventy-plugin-rss");
  eleventyConfig.addPlugin(pluginRss);

  const eleventyDrafts = require("./src/eleventy.config.drafts.js");
  eleventyConfig.addPlugin(eleventyDrafts);

  const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");
  const postcss = require("postcss");
  const postcssMinify = require("postcss-minify");
  eleventyConfig.addPlugin(bundlerPlugin, {
    transforms: [
      async function (content) {
        // this.type returns the bundle name.
        if (this.type === "css") {
          // Same as Eleventy transforms, this.page is available here.
          let result = await postcss([postcssMinify]).process(content, {
            from: this.page.inputPath,
            to: null,
          });
          return result.css;
        }

        return content;
      },
    ],
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
  };
};
