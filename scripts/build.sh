# Clean
rm -rf cjs dist

# ESM
tsc -p tsconfig.es.json

# CJS
PACKAGE_JSON_CONTENT=`cat package.json`
sed 's/"module"/"commonjs"/g' package.json > package.json
tsc -p tsconfig.cjs.json
echo "$PACKAGE_JSON_CONTENT" > package.json
echo '{"type": "commonjs"}' > cjs/package.json
