const parseCommitList = (value) => {
  const regexp = /commit\s(.*?)\nAuthor:\s(.*?)\s<(.*?)>\nDate:\s+(.*?)\n\n\s+(.*)/ig;
  const str = value.toString().trim();
  let commitsMatch = [];
  let result;

  do {
    result = regexp.exec(str);
    if (result) {
      commitsMatch = [...commitsMatch, result.slice(1, 6)];
    }
  } while (result);

  const commits = commitsMatch.map(arr => {
    const [hash, name, email, date, message] = arr;
    const shortHash = hash.slice(0, 8);

    return { hash, shortHash, author: { name, email }, date, message };
  });

  return commits;
};

module.exports = parseCommitList;
