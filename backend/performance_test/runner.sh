
for i in 1 10 100 1000
do
truffle migrate --network advanced --reset --compile-all

node performancetest.js $i
done 
