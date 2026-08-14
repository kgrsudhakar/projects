export const handler = async (event) => {
  for (const record of event.Records || []) {
    console.log("Processing SQS message:", record.body);
  }

  return {
    statusCode: 200,
    processed: event.Records?.length || 0
  };
};
