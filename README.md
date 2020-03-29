# iamschulz hugo site

## install
- install hugo on the webserver
  - https://lab.uberspace.de/guide_hugo.html
  - serve `./dist`
- git clone with submodules
  - `git clone --recurse-submodules -j2 https://github.com/iamschulz/iamschulz-hugo.git`
  - note that my blog content is private
- build theme
  - for yarn: `cd themes/iamschulz-hugo-theme/ && yarn install && yarn build`
  - for npm: `cd themes/iamschulz-hugo-theme/ && npm install && npm run build`
- `hugo --destination ./dist`


## update
- pull new content from submodule
  - `git submodule foreach git pull`
- render new static site
  - `hugo --cleanDestinationDir --destination ./dist`