# Chick Rocks deploy Makefile.
# Live site: WordPress on SiteGround at https://chickrocksus.com.
# Theme is built from this React/Vite app and rsync'd into the chick-rocks/ theme dir.

SHELL := /bin/bash

# --- SiteGround SSH connection ---
SG_HOST       := c1114776.sgvps.net
SG_USER       := u81-pwpukol4fyt4
SG_PORT       := 18765
SG_KEY        := $(HOME)/.ssh/id_ed25519
SG_THEME_PATH := www/chickrocksus.com/public_html/wp-content/themes/chick-rocks
SG_WP_ROOT    := www/chickrocksus.com/public_html

SSH_OPTS  := -p $(SG_PORT) -i $(SG_KEY) -o IdentitiesOnly=yes
SSH_CMD   := ssh $(SSH_OPTS) $(SG_USER)@$(SG_HOST)
RSYNC_SSH := ssh $(SSH_OPTS)

LOCAL_THEME_DIR := wordpress-theme

.PHONY: help prod build backup deploy deploy-clean ssh push pull-backup fix-maintenance set-faq-phone purge-cache

help:
	@echo "Targets:"
	@echo "  make prod          Build, back up live theme, rsync to SiteGround"
	@echo "  make build         Build the WordPress theme into ./wordpress-theme/"
	@echo "  make backup        tar the live chick-rocks theme into ~/backups/ on the server"
	@echo "  make deploy        rsync ./wordpress-theme/ to SiteGround (no --delete)"
	@echo "  make deploy-clean  rsync with --delete (mirrors local exactly, removes stale files)"
	@echo "  make ssh           Open an interactive SSH shell on SiteGround"
	@echo "  make push          git push origin main"
	@echo "  make pull-backup   Download newest backup tarball to ./backups/"
	@echo "  make fix-maintenance  Remove stuck .maintenance file from WP root"

prod: build backup deploy
	@echo ""
	@echo "Deployed to https://chickrocksus.com"

build:
	npm run build:wordpress

backup:
	@echo "→ Backing up live theme on SiteGround…"
	$(SSH_CMD) 'set -e; mkdir -p ~/backups; cd ~/$(SG_THEME_PATH)/..; ts=$$(date +%Y%m%d-%H%M%S); tar -czf ~/backups/chick-rocks-$$ts.tar.gz chick-rocks; echo "Backup: ~/backups/chick-rocks-$$ts.tar.gz"; ls -lh ~/backups/ | tail -5'

deploy:
	@test -d $(LOCAL_THEME_DIR) || { echo "❌ $(LOCAL_THEME_DIR)/ missing — run 'make build' first."; exit 1; }
	@echo "→ Rsyncing $(LOCAL_THEME_DIR)/ → $(SG_USER)@$(SG_HOST):~/$(SG_THEME_PATH)/"
	rsync -avz --human-readable --exclude='.DS_Store' \
		-e "$(RSYNC_SSH)" \
		$(LOCAL_THEME_DIR)/ \
		$(SG_USER)@$(SG_HOST):$(SG_THEME_PATH)/

deploy-clean:
	@test -d $(LOCAL_THEME_DIR) || { echo "❌ $(LOCAL_THEME_DIR)/ missing — run 'make build' first."; exit 1; }
	@echo "→ Rsyncing (with --delete) $(LOCAL_THEME_DIR)/ → $(SG_USER)@$(SG_HOST):~/$(SG_THEME_PATH)/"
	rsync -avz --human-readable --delete --exclude='.DS_Store' \
		-e "$(RSYNC_SSH)" \
		$(LOCAL_THEME_DIR)/ \
		$(SG_USER)@$(SG_HOST):$(SG_THEME_PATH)/

ssh:
	$(SSH_CMD)

push:
	git push origin main

pull-backup:
	@mkdir -p backups
	@latest=$$($(SSH_CMD) 'ls -t ~/backups/chick-rocks-*.tar.gz | head -1'); \
		echo "Pulling $$latest"; \
		rsync -avz --human-readable -e "$(RSYNC_SSH)" \
			$(SG_USER)@$(SG_HOST):"$$latest" backups/

set-faq-phone:
	@echo "→ Updating FAQ bottom CTA text to phone number on live site…"
	$(SSH_CMD) 'cd ~/$(SG_WP_ROOT) && id=$$(wp post list --post_type=page --name=faq --field=ID --format=ids); if [ -z "$$id" ]; then echo "❌ FAQ page not found"; exit 1; fi; echo "FAQ page ID: $$id"; echo "Before: $$(wp post meta get $$id faq_bottom_cta_primary 2>/dev/null)"; wp post meta update $$id faq_bottom_cta_primary "(347) 242-3449"; echo "After:  $$(wp post meta get $$id faq_bottom_cta_primary)"'

purge-cache:
	@echo "→ Purging SiteGround cache on live site…"
	$(SSH_CMD) 'cd ~/$(SG_WP_ROOT) && wp sg purge 2>&1 || echo "(sg purge unavailable; flushing WP cache)"; wp cache flush 2>&1 || true'

fix-maintenance:
	@echo "→ Checking for stuck .maintenance file on live site…"
	$(SSH_CMD) 'cd ~/$(SG_WP_ROOT) && if [ -f .maintenance ]; then ls -l .maintenance && rm -f .maintenance && echo "✅ Removed .maintenance"; else echo "No .maintenance file present."; fi'
