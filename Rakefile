JS_SRC = "public/js/src"
JS_APP = "public/js/src/app"
JS_LIB = "public/js/lib"
JS_BIN = "public/js/bin"
JS_HINT_LOG = "../logs/jshint.log"

CSS_SRC = "public/css/src"
CSS_LIB = "public/css/lib"
CSS_BIN = "public/css/bin"

# Compiles scripts
def installed?(program)
  cmd = "which #{program}"
  File.executable?(`#{cmd}`.strip)
end

desc 'Runs all javascript and css related jobs'
task :default do
  Rake::Task['lang'].invoke
  Rake::Task['css'].invoke
  Rake::Task['js'].invoke
  puts "==== DONE ===="
end

task :watch do
  begin
    require 'watchr'
    script = Watchr::Script.new
    script.watch('(js|css)/(src|lib)/.*') { system 'rake' }
    contrl = Watchr::Controller.new(script, Watchr.handler.new)
    contrl.run
  rescue LoadError
    fail "You need watchr! Install it by running `gem install watchr`"
  end
end

task :jshint do
  FileList["#{JS_APP}/*.js"].each do |f|
    fname = f.strip.split("/")[-1]
    puts "---> Running jshint against #{JS_APP}/#{fname}"
    `jshint #{JS_APP}/#{fname} > #{JS_HINT_LOG}`
  end
end

task :lang do
  puts "---> Building compiled lang files"
  `cd php; php -f langbuilder.php`
end

desc 'Compiles, and concatenates javascript and coffeescript'
task :js do
  if FileList["#{JS_SRC}/*.js"].exclude("*.min.js").any?
  	FileList["#{JS_SRC}/*.js"].exclude("*.min.js").each do |f|
      fname = f.strip.split("/")[-1]
      puts "---> Copying #{fname} from src to bin folder"
      `cp #{JS_SRC}/#{fname} #{JS_BIN}/`
    end
  end

  FileList["#{JS_SRC}/*.js"].exclude("*.min.js").each do |f|
    fullname = f.strip.split("/")[-1]
    modulename = fullname.split(".")[0]
    minname = modulename + ".min.js"
    
    puts "---> Building require.js optimized bundle for #{fullname}"
    `r.js -o name=../src/#{modulename} out=#{JS_BIN}/#{fullname} baseUrl=public/js/lib optimize=none`
    puts "---> Building require.js optimized and minified bundle for #{fullname}"
    `r.js -o name=../src/#{modulename} out=#{JS_BIN}/#{minname} baseUrl=public/js/lib`
  end

  #`r.js -o name=../src/main out=#{JS_BIN}/main.min.js baseUrl=public/js/lib`
  #`r.js -o name=../src/main out=#{JS_BIN}/main.js baseUrl=public/js/lib optimize=none`
end

desc 'Compiles, concatenates, and minifies css, less, and sass'
task :css do
  if FileList["#{CSS_SRC}/*.css"].any?
    puts "---> Copying over raw css files"
    `cp #{CSS_SRC}/*.css #{CSS_BIN}/`
  end

  Dir["#{CSS_SRC}/*/"].each do |d|
    if FileList["#{d}*.css"].any?
      dname = d.strip.split("/")[-1]
      puts "---> Concatenating all css files inside of #{dname} to #{dname}.css"
      `cat #{d}*.css > #{CSS_BIN}/#{dname}.css`
    end
    if FileList["#{d}*.less"].any?
      fail "You should not concatenate less files. Use the @import directive instead and put extra less files in the 'lib' directory"
    end
    if FileList["#{d}*.scss"].any?
      fail "You should not concatenate scss files. Use the @import directive instead and put extra scss files in the 'lib' directory"
    end
  end

  if FileList["#{CSS_SRC}/*.less"].any?
    FileList["#{CSS_SRC}/*.less"].each do |f|
      fname = f.strip.split("/")[-1]
      if installed? "lessc"
        css_name = fname.sub(/\.less/, ".css")
        puts "---> Compiling #{fname} to #{css_name}"
        `lessc #{f} > #{CSS_BIN}/#{css_name}`

        min_name = fname.sub(/\.less/, ".min.css")
        puts "---> Compiling and minifying #{fname} to #{min_name}"
        `lessc #{f} --compress > #{CSS_BIN}/#{min_name}`
      else
        fail "You need less! Install it by running: `npm install -g less`"
      end
    end
  end

  if FileList["#{CSS_SRC}/*.scss"].any?
    FileList["#{CSS_SRC}/*.scss"].each do |f|
      fname = f.strip.split("/")[-1]
      if installed? "sass"
        css_name = fname.sub(/\.scss/, ".css")
        puts "---> Compiling #{fname} to #{css_name}"
        `sass #{f} > #{CSS_BIN}/#{css_name}`
      else
        fail "You need sass! Install it by running: `gem install sass`"
      end
    end
  end
end
