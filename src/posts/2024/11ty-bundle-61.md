---
bundleIssue: 61
eleventyComputed:
  title: "Issue {{ bundleIssue }} - Fill out Survey Awesome, Eleventy Import arrives, Jérôme Coupé updated his Eleventy Intro, Robb Knight cooks, New docs for Eleventy Fetch 5, Pagefind v1.2.0, Pack11ty at v3.0.0...And 14 releases, 19 posts and 22 sites to see"
  description: "11ty Bundle Issue {{ bundleIssue }}"
date: 2024-11-26
tags:
  - 11ty Bundle
---

_An email version of this blog is available. **[Subscribe here](#newsletter-subscribe)**._

---

**_Some notes from Bob:_**

1. _We're back from our international travel. It's been almost a month since the [last issue](/blog/11ty-bundle-60/), so this issue is a big one._

2. _I've decided to do a little housekeeping. I've removed one starter that was on a version of Eleventy less than 1.0. I've also removed a few sites that were no longer available._

3. _For those of you who subscribe to the email version of this, apologies in advance for the "message clipping" that Gmail will likely do._

4. _Enjoy!_

---

**Fill out Survey Awesome.** From the Eleventy blog, Zach is [asking for help by filling out Survey Awesome](https://www.11ty.dev/blog/survey-awesome/): _"As 11ty joined Font Awesome a few short months ago, our project is again relying on survey results to inform future priorities and focus. Alongside the Font Awesome folks, we’re giving the 11ty Community a first look at [Survey Awesome](https://survey.awesome.me/) — a larger and more comprehensive survey about how folks are building for the web, start to end."_

**Eleventy Import arrives.** Zach recently released a new thing, [eleventy-import](https://github.com/11ty/eleventy-import#11tyimport). It's a small utility (and CLI) to import content files from various content sources. [Check out the features](https://github.com/11ty/eleventy-import#11tyimport).

**Jérôme Coupé updated his Eleventy Intro.** Just heard about this last night, but it's an awesome [intro to Eleventy](https://github.com/jeromecoupe/iad_eleventy_introduction/blob/master/eleventy_introduction_en.md#eleventy-11ty-by-zach-leatherman) that Jérôme uses to teach a workshop.

**Robb Knight cooks.** Robb has spilled (at least) [three](https://rknight.me/blog/thinking-about-recipe-formats-more-than-anyone-should/) [blog](https://rknight.me/blog/why-is-no-one-using-the-recipe-schema/) [posts](https://rknight.me/blog/adding-cooklang-support-to-eleventy-two-ways/) about using [cooklang](https://cooklang.org/), a Recipe Markup Language, culminating in this one, titled [Adding Cooklang Support to Eleventy Three Ways](https://rknight.me/blog/adding-cooklang-support-to-eleventy-two-ways/).

**New docs for Eleventy Fetch 5.** The [docs for the Eleventy Fetch plugin](https://www.11ty.dev/docs/plugins/fetch/) have been updated to reflect the latest version, i.e., v5.0+. Here's a look at the [release notes](https://github.com/11ty/eleventy-fetch/releases/tag/v5.0.0), full of the new goodies.

**Pagefind v1.2.0.** The popular static site search package, Pagefind, has been updated to v1.2.0. [Check out the release notes](https://github.com/CloudCannon/pagefind/releases/tag/v1.2.0). I have not updated here or on my personal site yet.

**Pack11ty at v3.0.0.** Nicolas Hoizey has updated his opinionated Eleventy template to v3.0.0. It's an exceptionally feature-rich starter. [Check out the docs](https://pack11ty.dev/documentation/).

**One more thing...speeding up local build times.** I recently wrote a [short blog post](https://www.bobmonsour.com/posts/fast-as-hell/) about how I updated my personal site by removing the shortcode related to the eleventy-img plugin and making use of the new-in-v5 of the plugin Transform capability. I don't think that the impact on local build times has been highlighted well enough. In short, when you use the Transform and you're developing locally, images are not processed until requested by the browser. This deferred processing is handled in the Eleventy dev server. It reduced my local build time from 15 seconds to about 1 second. If you want a deeper dive, [Aleksandr Hovhannisyan](https://www.aleksandrhovhannisyan.com/) has an [excellent post](https://www.aleksandrhovhannisyan.com/blog/eleventy-image-transform/) about it. Also, [check out the docs](https://www.11ty.dev/docs/plugins/image/#eleventy-transform). If you have an image-heavy site, you won't regret the time spent to integrate this approach. Your build times will thank you.

I think that's more than a mouthful for this issue.

Until next time...

---

## Recent releases

{% set itemType = "release" %}
{% include 'partials/bundleitems.njk' %}

## Posts from around the web

{% set itemType = "blog post" %}
{% include 'partials/bundleitems.njk' %}

## Built with Eleventy

Here are the new sites to see. If you want to see more sites, check out the [Eleventy Leaderboards](https://www.11ty.dev/speedlify/).

{% set itemType = "site" %}
{% include 'partials/bundleitems.njk' %}
