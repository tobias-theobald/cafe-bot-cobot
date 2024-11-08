# Café Bot Cobot

☕️

A simple bot for members to note down their café expenses on the Cobot coworking space management platform. Note that members in this system are trusted to note down their expenses honestly. For example, if you have a fridge with drinks and someone takes something out, they are expected to not it down using this app.

The person installing this bot maintains a table of products to be sold in a [Google Sheet](https://docs.google.com/spreadsheets).

# How to deploy

## Considerations before deploying

The most important thing to keep in mind is probably to which account this is deployed. It might be okay to just use your personal Cobot account, but what happens if you ever leave the coworking space? I'm not saying you shouldn't do it, just saying to keep it in mind. Creating a special account for this that stays with the coworking space might be more work now, but consider if you really want to remember where you deployed this bot once you leave. 

Also, for ease of use, this project uses Google Sheets. You might have privacy reservations against it. Then again, it'll only contain your price list. 🤷

Lastly, this is a very detailed step-by-step guide aimed at non-developers. Unfortunately, these types of guides tend to not stay up-to-date as one of the involved services is bound to change something in their UI. So take the following with a grain of salt if you visit this guide a significant amount of time after its publishing in mid-November 2020 🧂

## What you need

1. Cobot Account that is associated with a coworking space where it or someone else has admin permissions
1. Google Account
1. An app to copy-paste notes. We'll have to note down some secure and complex keys/passwords, so pen and paper are not optimal here
1. Somewhere between 5 and 15 minutes of time

## 1. Create Google Sheet

You will copy our template, modify it and share it. 

1. Make sure you're logged in to your Google account as per the considerations section
1. Go to [the template sheet](https://docs.google.com/spreadsheets/d/1e5aZfpJ3SzkFug6S6vFVwQD1hlVLpTvoBivJMOUqIUw/edit)
1. **File** -> **Make a copy** -> Give it a name
1. Create your price list according to the instructions in the document. You can always edit this later.
1. Set up public sharing of the sheet. Click **Share** in the top right corner, then **Change to anyone with the link** at the bottom, click **Restricted** and select **Anyone with the link**. Make sure the box on the right says "Viewer". Then close the dialog 
1. **_Take note of your Google Sheet ID_**. You can find it in the URL of your copy of the sheet between the `https://docs.google.com/spreadsheets/d/` and the `/edit...`

## 2. Create Google Sheets API Key

In order for the bot to be able to access your Google Sheet, you need to create a key for the Google Sheets API.

1. Make sure you're still using the same Google Account as before
1. Go to the [Google Workspace API Create Project Documentation](https://developers.google.com/workspace/guides/create-project)
1. Follow that guide. When you are supposed to choose an API to enable **Enable the Google Sheets API**
1. In the [Google Cloud Console's Credentials section|https://console.cloud.google.com/apis/credentials], click **Create Credentials** and choose **API Key**, give it a name, click **Next**, then **_Take note of that API key_** and edit the API key's settings using the pen icon.
1. Under "Application Restrictions", click **HTTP referrers**, then under "Website Restrictions", click **Add an item**, enter `bots.apps.cobot.me/*` and click **Done**
1. Under "API restrictions", select **Restrict key**, then in the dropdown, select **Google Sheets API**
1. If you forgot to note down your API key earlier, do it now. You can find it in the top right.

## 3. Create Cobot OAuth Client

In order to create the charges for your users, they have to consent to giving the application this permission when they first use it.

1. Make sure you're logged in with the correct Cobot account as per the considerations section
1. Go to the [OAuth app registration page](https://www.cobot.me/oauth2_clients/new?scope=read_user+navigation+write_charges&link=https://bots.apps.cobot.me)
1. Give it a **Name** and a **Name within space**. They can be as simple as "Café".
1. The main application URL should read `https://bots.apps.cobot.me`.
1. Also set the Redirect URI to `https://bots.apps.cobot.me`
1. The scopes should read `navigation read_user write_charges`
1. Click **Register**. On the resulting page, **_take note of the Client ID and Client Secret_**

## 4. Create Cobot bot 🤖

Almost there. All you have to do now is create the actual bot.

1. Go to the [Cobot Bots](https://bots.apps.cobot.me) page
1. Click **Add Bot**
1. Give it a **Name**. It should be unique for you, for example `Cafe YOUR COWORKING SPACE`
1. Description is optional, but it might make sense to leave your future self a link to this README 
1. Set **Client ID** to the one you noted down in the Cobot OAuth Client step 3.7
1. Set **Client Secret** to the one you noted down in the last Cobot OAuth Client step 3.7
1. Set **Scope** to `navigation read_user write_charges`
1. Make sure **Authenticate users against Cobot** is checked
1. Under **Section** select **Members**
1. Click **Create Bot**. You'll be taken to a page with several code editor tabs.
1. Copy the content of the [index.html](./index.html) file to the HTML tab, replacing all existing code there
1. Copy the content of the [index.js](./index.js) file to the Javascript tab, replacing all existing code there
1. Modify the line that says `var gapiKey = "REPLACE ME";` to contain your Google API key you noted down earlier in step 2.4 instead of `REPLACE ME`. Make sure to retain the quotes `"`.
1. Modify the line that says `var googleSheetId = "REPLACE ME";` to contain your Google Sheet ID you noted down earlier in step 1.6 instead of `REPLACE ME`. Make sure to retain the quotes `"`.
1. Copy the content of the [index.scss](./index.scss) file to the SCSS tab, replacing all existing code there
1. Click the **Save code** button in the bottom right, then click **Back** in the bottom left.
1. Copy the link given in the **Share it** textbox.
1. If the Cobot space admin account is not yours, log in with that, visit the link and follow the on-screen instructions 
1. _or_ if the admin account belongs to another person give the link to them and have them visit it and follow the on-screen instructions
1. _or_ if you're the admin and already logged in, visit the link and follow the on-screen instructions

## 5. Try it out

Using the member view or a member account in your space's Cobot page, you should now see a new entry in the left navigation. When you or your members visit it for the first time, they have to give consent to their data being accessed by the bot. 

I promise that there's nothing in it that does anything with the data except create the charges. If you don't trust us, just look at the code.

After giving consent, your members can now pay for Café expenses in Cobot 🙂💸

# Maintenance

## Edit bot code

Go to the [Cobot Bots](https://bots.apps.cobot.me) page, choose the bot you created, then either settings or edit code

## Change some prices

Just edit your [Google Sheet](https://docs.google.com/spreadsheets). The structure should be self-explanatory.

## Edit VAT / GST

If you want to change the VAT rates, edit this Javascript portion:

```javascript
var vat = {
    regular: 19.0,
    reduced: 7.0
};
```

The numbers on the right are percentages, it's important to keep the dot `.` as a decimal symbol and NOT change it to comma! 

The system is prepared to take multiple levels of VAT. This example is for Germany, which has 19% VAT on general goods and prepared foods and 7% VAT on most items of daily use, such as unprepared foods. The names on the left have to be same as in the corresponding column in the Google Doc.

## Edit currency symbol

In the Javascript portion of the code, look for this section:

```javascript
var currency = '€';
```

Just change the symbol to whatever you like (e.g. `$`, `USD`, `£`), but make sure to keep the single quotes `'` around it. 

## Change colors / theming

You want to be fancy huh 🤨? Try playing around with classes in the HTML section and colors in the SCSS section. I'm a developer, I don't care how bad or basic it looks, I'm just here to make sure it works 😛

## Set an accounting code

In the `function buy() {...` section, there's a variable created called `opts` that's used to create the charge:

```javascript
var opts = {
    tax_rate: '' + vat[product.vat],
    description: typeof product.name === 'object' ? product.name[language] : product.name,
    amount: 1 / (1 + vat[product.vat] / 100) * product.endPrice,
};
```

According to the [API Docs](https://www.cobot.me/api-docs/one-time-charges), all you need to add is a line called `accounting_code` and give your accounting code's name:

```javascript
var opts = {
    tax_rate: '' + vat[product.vat],
    description: typeof product.name === 'object' ? product.name[language] : product.name,
    amount: 1 / (1 + vat[product.vat] / 100) * product.endPrice,
    accounting_code: 'Cafe',
};
```

# Possible future extensions

I could see this bot being able to determine which kind of user is accessing it and give an option to edit the prices. They would then be put in the storage mentioned in the "Edit Code" page's "Documentation" tab. This would make it possible to distribute the bot on Cobot's add-on page and remove the need to the slightly complicated Google Docs setup.   

# Helpful Links

* [Cobot Bots](https://bots.apps.cobot.me)
* [Cobot API Documentation](https://www.cobot.me/api-docs/)
* [Google Docs API Quickstart](https://developers.google.com/docs/api/quickstart/js)

# Footnotes

Thanks to the Cobot team and especially to Maddy for giving me the kick in the butt to write this up. You're all doing a great job, keep it up 👍 

This bot was created in 2018, but this write-up and the code was published during the 2020/2021 COVID-19 pandemic 🦠😷 I hope you're safe 🙏

Much love ❤️ and remember to hug each other more (after the pandemic is over, of course)

The coffee junkies from [Fase 15](https://www.fase15.de/) ☕☕☕️
