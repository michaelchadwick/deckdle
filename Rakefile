task :deploy do |t|
  sh "git push origin main"
  sh "rsync -auP --no-p --exclude-from='rsync-exclude.txt' . $DECKDLE_REMOTE"
end

task :default => [:deploy]
