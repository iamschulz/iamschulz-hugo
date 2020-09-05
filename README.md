# iamschulz hugo site

## install
- install hugo on the webserver
  - https://lab.uberspace.de/guide_hugo.html
  - serve `./dist`
- git clone with submodules
  - `git clone --recurse-submodules -j2 https://github.com/iamschulz/iamschulz-hugo.git`
  - note that my blog content is private
- setup
  - `./hugoctl install`
  - `./hugoctl build`
- deploy
  - `./hugoctl deploy`


## update
- pull new content from submodule
  - `git submodule foreach git pull`
- render new static site
  - `hugo --cleanDestinationDir --destination ./dist`


## develop environment
- `git clone --recurse-submodules -j2 https://github.com/iamschulz/iamschulz-hugo.git`
- `./hugoctl install`
- `./hugoctl build`
- `./hugoctl dev`