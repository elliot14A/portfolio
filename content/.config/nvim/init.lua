-- You found the config.
--
-- The real one lives in nix, at ~/.config/home-manager/modules/nixvim/.
-- This is the browser's approximation of it -- the same options, applied to
-- a buffer made of <div>s instead of a terminal grid.

vim.g.mapleader = " "

vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.scrolloff = 8
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.wrap = false
vim.opt.hlsearch = true
vim.opt.incsearch = true
vim.opt.termguicolors = true

require("rose-pine").setup({
  style = "main",
  transparent_background = true,
})

require("neo-tree").setup({
  window = { position = "right", width = 30 },
})

-- Nothing here is load-bearing. The site reads the nix files.
