echo 'Build creator'
START=$(date +%s.%N)
if ng build --prod | grep -q 'error'; then
   echo "Unable to build, ABORTING ('ng build' return errors)" 
   return .
fi
END=$(date +%s.%N)
DIFF=$(echo "$END - $START" | bc)
echo 'Build successful in ' $DIFF ' s.'
rm -R public/*
cp -R dist/ng-admin/. public/
mkdir -p public/api/ && cp -R backend/. public/api/
rm -R public/3rdpartylicenses.txt