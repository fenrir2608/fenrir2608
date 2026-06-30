# fenrir2608 GitHub profile — sponsors README

This repo powers the README on [github.com/fenrir2608](https://github.com/fenrir2608) using [JamesIves/github-sponsors-readme-action](https://github.com/JamesIves/github-sponsors-readme-action).

## One-time setup (signed in as **fenrir2608**)

1. Create the profile repo on GitHub (must be public, named exactly `fenrir2608`):

   ```bash
   gh repo create fenrir2608 --public --description "Fenrir's GitHub profile"
   ```

2. Push this folder:

   ```bash
   cd fenrir2608-profile
   git init
   git add .
   git commit -m "feat: profile README with automated sponsors"
   git branch -M main
   git remote add origin https://github.com/fenrir2608/fenrir2608.git
   git push -u origin main
   ```

3. Add a **Personal Access Token** as repo secret `PAT`:
   - Create at GitHub → Settings → Developer settings → Fine-grained tokens (or classic)
   - Scopes: `read:user`, `read:org` (and `repo` if using classic for private repos)
   - Must belong to **fenrir2608** (the account that receives sponsorships)
   - Repo → Settings → Secrets and variables → Actions → New secret → name `PAT`

4. Run the workflow once: Actions → **Update Sponsors README** → Run workflow.

The workflow updates **Current Sponsors** (active) and **Past Sponsors** (inactive only) daily and on demand.
