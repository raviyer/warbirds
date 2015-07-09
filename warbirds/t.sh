set c=1
for i in $(cat asset_codes.txt) ; 
do
  echo -n $i " "
  if ((c % 6 == 0)); then
      echo
  fi
  c=$((c + 1))
done
