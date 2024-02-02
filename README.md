# git tag script

This script will take in some commits, and if the version has changed in a given commit, create an annotated tag for that commit with the package and version. It works with any JS monorepo or any repo that uses js packaging conventions.

> [!WARNING]
> You _do not_ want to run this script from inside the repo you are tagging.
> Since it checks out commits, ensure that the repo is in a clean state with no additional files that could potentially cause issues as we go back in time.

I filtered a list of commits first but it should work fine even if you ran it on every commit in a repo (although this might be quite slow), as it will only create a tag if the version changed in that commit. 

Run this in a fork first or do a dry run woth the tag commands commented out to make sure things work as expected.

I created a list of commits to check and potentially tag like this. Your script may differ (although simply removing the author filter should work if you version + release with [changesets](https://github.com/changesets/changesets)).

```bash
git log <starting_commit>^...HEAD \
  --author="pngwn" \
  --grep="chore: update versions" \
  --pretty="%H" >> log.txt
```


This script was created for the [`gradio` repo](https://github.com/gradio-app/gradio) and isn't universally useful but I'm putting it for when I inevitably need to do this again and can't remember how. A few tweaks and it will probably work for other cases.