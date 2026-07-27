-- You found the config.
--
-- The real one lives in nix, at ~/.config/home-manager/modules/nixvim/, split
-- across options.nix, keymaps.nix and plugins/. This is the same setup written
-- back out as the Lua that nix generates.

vim.g.mapleader = " "

-- options.nix
local opt = vim.opt
opt.number = true
opt.relativenumber = true

opt.tabstop = 2
opt.softtabstop = 2
opt.shiftwidth = 2
opt.expandtab = true
opt.smartindent = true
opt.wrap = false

opt.swapfile = false
opt.backup = false
opt.undofile = true

opt.hlsearch = true
opt.incsearch = true
opt.termguicolors = true

opt.scrolloff = 8
opt.sidescrolloff = 8
opt.updatetime = 50

opt.clipboard = "unnamedplus"

opt.splitbelow = true
opt.splitright = true

-- rose-pine, main, transparent so the terminal shows through
require("rose-pine").setup({
  style = "main",
  transparent_background = true,
  transparent_float = true,
})
vim.cmd.colorscheme("rose-pine")

-- lualine: one global bar, "|" between components
require("lualine").setup({
  options = {
    theme = "rose-pine",
    globalstatus = true,
    component_separators = { left = "|", right = "|" },
    section_separators = { left = "", right = "" },
  },
})

-- neo-tree on the right, 30 wide, dotfiles visible
require("neo-tree").setup({
  window = { position = "right", width = 30, auto_expand_width = true },
  filesystem = {
    filtered_items = { visible = true, hide_dotfiles = false },
    follow_current_file = { enabled = true },
  },
})

-- gitsigns: signs in the gutter, blame on the current line
require("gitsigns").setup({
  current_line_blame = true,
  signs = {
    add = { text = "+" },
    change = { text = "~" },
    delete = { text = "_" },
  },
})

require("ibl").setup({ indent = { char = "|" } })
require("telescope").load_extension("fzf")
require("flash").setup({ search = { mode = "fuzzy" } })
require("toggleterm").setup({
  direction = "float",
  float_opts = { border = "curved" },
})

-- one LSP server per language I work in
local lsp = require("lspconfig")
for _, server in ipairs({
  "rust_analyzer", "nixd", "gopls", "ts_ls", "html",
  "cssls", "tailwindcss", "pyright", "taplo", "ocamllsp",
}) do
  lsp[server].setup({})
end

local map = vim.keymap.set

-- windows and splits
map("n", "<C-h>", "<C-w>h")
map("n", "<C-j>", "<C-w>j")
map("n", "<C-k>", "<C-w>k")
map("n", "<C-l>", "<C-w>l")
map("n", "<leader>|", ":vsplit<CR>", { desc = "Vertical split" })
map("n", "<leader>-", ":split<CR>", { desc = "Horizontal split" })

-- buffers
map("n", "<S-l>", ":bnext<CR>", { desc = "Next buffer" })
map("n", "<S-h>", ":bprevious<CR>", { desc = "Previous buffer" })
map("n", "<S-q>", ":bdelete!<CR>", { desc = "Close buffer" })
map("n", "<leader>bb", ":e #<CR>", { desc = "Alternate buffer" })
map("n", "<leader>`", ":e #<CR>", { desc = "Alternate buffer" })

-- explorer, terminal, telescope
map("n", "<leader>e", ":Neotree toggle<CR>", { desc = "File explorer" })
map({ "n", "t" }, "<C-\\>", "<cmd>ToggleTerm<cr>", { desc = "Terminal" })
map("n", "<leader>ff", "<cmd>Telescope find_files<cr>", { desc = "Find files" })
map("n", "<leader>fg", "<cmd>Telescope live_grep<cr>", { desc = "Live grep" })
map("n", "<leader>fw", "<cmd>Telescope grep_string<cr>", { desc = "Grep word" })
map("n", "<leader>fb", "<cmd>Telescope buffers<cr>", { desc = "Find buffers" })

-- harpoon
local harpoon = require("harpoon")
map("n", "<leader>a", function() harpoon:list():add() end, { desc = "Harpoon add" })
map("n", "<leader>h", function() harpoon.ui:toggle_quick_menu(harpoon:list()) end)
map("n", "<leader>1", function() harpoon:list():select(1) end)
map("n", "<leader>2", function() harpoon:list():select(2) end)

-- flash jumps
map({ "n", "x", "o" }, "s", function() require("flash").jump() end, { desc = "Flash" })
map({ "n", "x", "o" }, "S", function() require("flash").treesitter() end)

-- LSP
map("n", "gd", vim.lsp.buf.definition, { desc = "Definition" })
map("n", "gr", vim.lsp.buf.references, { desc = "References" })
map("n", "K", vim.lsp.buf.hover, { desc = "Hover" })
map("n", "<leader>la", vim.lsp.buf.code_action, { desc = "Code action" })
map("n", "<leader>lr", vim.lsp.buf.rename, { desc = "Rename" })
map("n", "<leader>j", vim.diagnostic.goto_next, { desc = "Next diagnostic" })
map("n", "<leader>k", vim.diagnostic.goto_prev, { desc = "Prev diagnostic" })

-- move selected lines, keep the selection when indenting
map("v", "J", ":m '>+1<CR>gv=gv")
map("v", "K", ":m '<-2<CR>gv=gv")
map("v", "<", "<gv")
map("v", ">", ">gv")

map("n", "<Esc>", ":nohlsearch<CR>")
