# Quick Start: Deploy to Cloudflare Pages

## 🚀 Fastest Way (5 minutes)

### Step 1: Push Your Code
```bash
git add .
git commit -m "feat: configure Cloudflare Pages deployment"
git push origin main
```

### Step 2: Connect to Cloudflare
1. Go to [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages)
2. Click **"Create a project"**
3. Click **"Connect to Git"**
4. Authorize GitHub
5. Select `adamsimms/adamsimms.xyz`

### Step 3: Configure Build
```
Project name: adamsimms-xyz
Production branch: main
Build command: npm run build
Build output directory: .
```

### Step 4: Deploy
Click **"Save and Deploy"**

✅ **Done!** Your site will be live at `https://adamsimms-xyz.pages.dev`

---

## 🌐 Add Custom Domain (adamsimms.xyz)

### In Cloudflare Pages Dashboard:
1. Go to your project → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter `adamsimms.xyz`
4. Click **"Continue"**

### Cloudflare will automatically:
- Create DNS records
- Provision SSL certificate
- Configure redirects

⏰ **DNS propagation**: 5-15 minutes

---

## 🤖 Automate with GitHub Actions

### Add Secrets to GitHub:

1. **Get Cloudflare API Token:**
   - Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click **"Create Token"**
   - Use **"Edit Cloudflare Workers"** template
   - Copy token

2. **Get Account ID:**
   - In Cloudflare dashboard, copy Account ID from sidebar

3. **Add to GitHub:**
   - Go to repo **Settings → Secrets → Actions**
   - Add `CLOUDFLARE_API_TOKEN`
   - Add `CLOUDFLARE_ACCOUNT_ID`

✅ **Now every push to main auto-deploys!**

---

## 📦 Deploy from CLI

```bash
# Install dependencies
npm install

# Login to Cloudflare
npm run cf:login

# Deploy
npm run deploy
```

---

## 🔍 Preview Deployments

Every PR gets a preview URL automatically:
- Format: `https://adamsimms-xyz-BRANCH.pages.dev`
- Updates with each commit
- Perfect for testing before merge

---

## 📊 Enable Web Analytics (Free)

1. In Pages project → **Web Analytics**
2. Click **"Enable"**
3. Copy the script tag
4. Add to `index.html` before `</body>`

---

## ⚡ What You Get

✅ Global CDN (300+ locations)
✅ Unlimited bandwidth
✅ Automatic HTTPS
✅ Security headers (via `_headers` file)
✅ Preview deployments for PRs
✅ Free Web Analytics
✅ 20-minute build timeout
✅ Automatic asset optimization

---

## 🆘 Troubleshooting

**Build fails?**
```bash
# Test locally
npm run build

# Check logs
npx wrangler pages deployment list --project-name=adamsimms-xyz
```

**Domain not working?**
- Wait 15 minutes for DNS propagation
- Check DNS: `dig adamsimms.xyz`
- Verify SSL status in dashboard

**Need help?**
- Full guide: See `CLOUDFLARE_DEPLOYMENT.md`
- Cloudflare Docs: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)

---

## 📝 What Changed

Files added/modified:
- ✅ `wrangler.toml` - Cloudflare configuration
- ✅ `_redirects` - URL redirects (www → non-www)
- ✅ `.github/workflows/cloudflare-pages.yml` - Auto-deployment
- ✅ `package.json` - Added deploy commands
- ✅ `.github/workflows/ci.yml` - Disabled GitHub Pages deploy

---

**Ready to deploy!** 🚀
