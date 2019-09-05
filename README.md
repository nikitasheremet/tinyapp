# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product
Users are able to create an account and keep a list of custom shortened URLs. Passwords are encrypted using bcrypt and all cookies are encrypted using cookie-session, allowing for a secure browsing experience. 

Created URLs can be edited or deleted with ease.

!["Landing Page for not logged in users"](https://github.com/nikitasheremet/tinyapp/blob/master/docs/landing-page-not-logged-in.png?raw=true)
!["User register page"](https://github.com/nikitasheremet/tinyapp/blob/master/docs/register-page.png?raw=true)
!["Landing Page for logged in Users"](https://github.com/nikitasheremet/tinyapp/blob/master/docs/landing-page-logged-in.png?raw=true)
!["Short URL diplay page/edit page"](https://github.com/nikitasheremet/tinyapp/blob/master/docs/short-url-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.