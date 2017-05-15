# Ember Analyze Vendor Modules

`yarn add global ember-analyze-vendor-modules`

OR

`npm install -g ember-analyze-venor-modules`

Then from within your ember project:

**Step 1: Build for Production**

`ember b -e production`

**Step 2: Analyze**

`analyze-vendor`

**Step 3: Save analysis and include individual modules**

`analyze-vendor -show > analysis.txt`