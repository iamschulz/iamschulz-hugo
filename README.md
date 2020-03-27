# iamschulz hugo site

## install
- install hugo on the webserver
  - https://lab.uberspace.de/guide_hugo.html
  - serve `./dist`
- git clone with submodules
  - pull theme from theme repo
  - pull posts and statics from content repo
- `hugo --destination ./dist`


## update
- update content md
- `hugo --cleanDestinationDir --destination ./dist`