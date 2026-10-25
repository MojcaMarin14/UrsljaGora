# Uršlja gora: instructions for the website owner

The existing frontend at https://urslja-gora.vercel.app stays on Vercel. Its current hosting and settings have not been changed. The recovered CMS is local for now; edits there will appear on the live site only after your maintainer connects it later. The website keeps its current design. You edit supported content in Strapi using your browser. A technical maintainer must complete backend hosting, CMS domain and backup setup before connecting this CMS to the existing website. The local preparation has not published anything.

## Your everyday work

1. Open the CMS address supplied by your maintainer, usually `https://cms.YOUR-DOMAIN.si/admin`.
2. Sign in using your own account. Keep the password in a password manager.
3. Choose **Content Manager**. Open **Novice**, **Dogodki**, or **Ponudbe**.
4. Open an existing item or choose **Create new entry**. Enter the title, description and date, and choose an image from the Media library.
5. Choose **Save** to keep a draft. Choose **Publish** when it is ready for visitors. Saving alone does not publish a change.
6. Open the public website and check the result. Refresh the page if necessary.

Keep a news item's **slug** (its address) unchanged after publishing, so old links continue to work. Events and offers use stable document addresses.

## Images

Open **Media library** to upload or reuse images. Use JPEG, PNG, WebP or AVIF photos. Resize large camera photos before uploading; around 1,500–2,000 pixels wide is usually sufficient. Public visitor uploads have a 5 MB limit; admin uploads have a 50 MB limit. Choose descriptive filenames and add alternative text when available.

## Visitor messages and map photos

New visitor messages (**Pohvala**) and map photos (**Mapa fotografija**) start with **odobrena** switched off. Check the text and image; switch **odobrena** on only if you want to display them. Save and, where shown, Publish. Visitors cannot approve their own submissions. The Media library can also contain visitor uploads awaiting review.

**Točka na mapi** allows additional CMS-managed map points. Existing walking routes and built-in points remain part of the website code.

## What needs your maintainer

The main page text, room descriptions, menu, contact details, built-in walking routes and panorama gallery are currently written in the website code. They are not editable in Strapi yet. Ask the maintainer to update these, or to move a specific section into the CMS. The separate Article collection is retained but is not currently used by the frontend.

Ask the maintainer to create named accounts for each editor rather than sharing one administrator account. The temporary local test accounts must not be used on the live site. A Strapi data export does not carry administrator accounts; your maintainer creates your new account during migration.

## Ownership and care

Keep the domain registration, Hetzner account, backup storage account and recovery password under the owner's control. Set renewal reminders. Have one named technical contact who checks updates, free disk space and nightly backups. Ask for a restore test periodically; a backup is useful only if it can be recovered.

If the site stops working, contact your maintainer. Do not reset the database or reinstall the CMS. The contact form remains part of the existing Vercel website. Its email and anti-spam settings stay there; moving only the CMS does not require moving those settings.

## Reviewing visitor photos

Open **Media library → API Uploads** to see pending visitor images. Their preview links are private, last five minutes and must not be shared; refresh the admin page if a preview expires. Unapproved submissions and their direct image files are blocked from public access. In **Mapa fotografija**, review the image/text and turn on **odobrena** only when you want it public. To hide it again, turn approval off and save. Previously published copies may remain in browsers or third-party caches. Guestbook messages use the same approval switch. Public visitor account registration is disabled; the maintainer creates named editor accounts separately.
