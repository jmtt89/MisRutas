module.exports = {
  "globDirectory": ".\\",
  "globPatterns": [
    "**/*.{sample,json,html,js,md,webm,png,gif,php,dll,pdb,cs,asax,csproj,user,cshtml,config,sln,cur,mp3,ogg,dae,xml,jpg,css,yml,txt,vtt,eot,svg,ttf,woff,woff2,otf,example,scss,ejs,wav,mp4,swf}"
  ],
  "swDest": "sw.js",
  "globIgnores": [
    "bower.json",
    "package.json",
    "node_modules/**/*",
    "workbox-cli-config.js"
  ],
  runtimeCaching:[
    {
      urlPattern: 'https://code.jquery.com/**/*',
      handler: 'cacheFirst'
    },{
      urlPattern: 'https://maps.googleapis.com/**/*',
      handler: 'cacheFirst'
    }
  ]
};

