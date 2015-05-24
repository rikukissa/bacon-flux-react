import {method} from 'lodash';
import {zipAsArray, fromPromise, Bus} from 'baconjs';

const COMMITS_URL = 'https://api.github.com/repos/leonidas/gulp-project-template/commits';
const REPO_URL = 'https://api.github.com/repos/leonidas/gulp-project-template';

function createFetchStream(url) {
  return fromPromise(fetch(url).then(method('json')));
}

export const refresh = new Bus();

const refreshRepository = refresh.flatMap(() => createFetchStream(REPO_URL));
const refreshCommits = refresh.flatMap(() => createFetchStream(COMMITS_URL));

const repositoryData = refreshRepository.merge(createFetchStream(REPO_URL));
const commitsData = refreshCommits.merge(createFetchStream(COMMITS_URL));

const repositoryStream = zipAsArray(repositoryData, commitsData)
.map(([repo, commits]) => {
  repo.commits = commits;
  return repo;
});

export const repository = repositoryStream.toProperty(null);

export const loading = repositoryStream.map(false)
  .merge(refresh.map(true))
  .toProperty(false);
