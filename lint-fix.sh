
#echo '================'
#echo 'Lint error fixer'
#echo '================'
#echo '1) File should end with a newline'
#ng lint | grep 'file should end with a newline' | while read -r line ; do
#    FILE=$(echo $line | sed "s/ERROR: \(.*\)\[\(.*\)/\1/")
#    echo "" >> $FILE
#    echo $FILE '- FIXED'
#done