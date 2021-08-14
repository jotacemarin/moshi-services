sls create --template aws-nodejs --path moshi-products
sls invoke local --function saveCode --path __mocks__/event.json
sls deploy --stage prod