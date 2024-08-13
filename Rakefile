task :deploy do |t|
  sh "git push origin main"
  sh "rsync -auP --no-p --exclude-from='rsync-exclude.txt' . $DECKDLE_REMOTE"
end

task :update_words do |t|
  sh "rsync -auP --no-p --include='/word*.txt' --exclude='*' --dry-run ./assets/text/ $DECKDLE_REMOTE"
end

task :default => [:deploy]
