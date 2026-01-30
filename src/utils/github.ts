import { Octokit } from "octokit";

const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN });
const OWNER = "ModusZero";
const REPO = "mod0";

export async function getGitHubContent(resource: string) {
  try {
    const routes: Record<string, string> = {
      'docs': 'docs/README.md',
      'collaborate': 'CONTRIBUTING.md',
      'blog': 'blog/LATEST.md',
      'first-steps': 'docs/getting-started.md',
      'get-product': 'PRODUCT_SPECS.md'
    };

    // --- LÓGICA DE RELEASES (CHANGELOG) ---
    if (resource === 'releases') {
      const { data } = await octokit.rest.repos.listReleases({ owner: OWNER, repo: REPO });
      
      return data.map(r => {
        // Formatear botones de descarga para los binarios (exe, dmg, etc)
        const downloads = r.assets.map(asset => {
          const size = (asset.size / (1024 * 1024)).toFixed(2);
          return `[Download ${asset.name} (v${r.tag_name}) — ${size} MB](${asset.browser_download_url})`;
        }).join('\n\n');

        return `## ${r.name || r.tag_name}\n*Published on ${new Date(r.published_at!).toLocaleDateString()}*\n\n${r.body}\n\n### 📦 Distributions\n${downloads || '_No binaries attached to this release._'}`;
      }).join('\n\n---\n\n');
    }

    // --- LÓGICA DE ARCHIVOS (MARKDOWN) ---
    const path = routes[resource] || 'README.md';
    const { data }: any = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: path,
    });

    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (e) {
    console.error("❌ GitHub Sync Error:", e);
    return "# Error 404\nNo se pudo sincronizar con la fuente de GitHub.";
  }
}