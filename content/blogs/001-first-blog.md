---
title: "Building something in public for the first time"
date: 2026-10-06
tags:
  - kuma
  - build-in-public
  - devlog
description: "Introductory post about building Kuma in public"
---

# Building something in public for the first time

> an introduction to building Kuma in public

## Introduction

Hi There!

I've been thinking about how I learn things for a while now. Unfortunately, I
have to think about it a little more seriously these days because I'm looking
for a job. When I was in college, I had a decent attention span. I could sit down
with a difficult concept, spend a few hours understanding shit and occasionally
even enjoy the process. Maybe I was a masochist back then. But now, fuck, I don't
even want to read a problem description end to end on LeetCode. Every time I
come across something I don't understand, I have Mr. Claude, who loves burning
tokens like an elephant gulping water after a marathon. It's either way too broad
for my liking or way too vague. The AI bros might argue,

`Ackchyually, you just need to give the model better context, use the right
skills, provide relevant reference material, define your constraints properly
and iterate on the prompt until you get the result you want.`

![Akshually nerd meme](https://media.elliot14a.work/memes/akshually-nerd.png)

And yeah, they're probably right. But now I'm doing half the fucking research
myself just to figure out what research I should give the AI. AI is pretty good
at finding things that are generally relevant, but finding the right material
for a very specific goal is a different problem. I also agree that if you give
an AI good reference material, it can genuinely help. Without it, it can
basically puke garbage with incredible confidence.

The actual problem I keep running into is `finding the right material.` Right
now I'm preparing for a System Design interview. I'm jumping between Hello
Interview, YouTube tutorials, random articles, GitHub repositories and whatever
else Google decides is relevant that day. I don't really have a concrete path. I
don't have a good way of knowing what I should learn next, and I'm manually
trying to keep track of what I've already covered. What I really want isn't
another explanation of what a load balancer is. I want someone to say:
`You're preparing for this particular thing? Here's what you should learn.
Here's what you should build. Here's what other engineers found difficult.
Here's what actually came up in interviews. Here's what you can skip.` And
ideally, that someone has actually gone through it themselves. So I started
thinking about what a community-driven platform for this could look like.

`Motherfu***r! that's just r/leetcode subreddit`
![Jordan Peele sweating meme](https://media.elliot14a.work/memes/thats-a-job.mp4)

Now, to be fair, if you're dedicated enough, you can probably just skim through
Reddit, GitHub, YouTube and whatever else, or even just ask an AI agent to find
the relevant stuff and put together a plan for you. So I'm not saying this is
some impossible problem that nobody has solved. I just want to build something
around it and see how far I can take a raw idea like this. Mostly for my own
sake, honestly. I've wanted to write and build something in public for a while,
and this feels like a good excuse to finally do it. So, I'm calling it Kuma.
The idea is basically `an open-source community/forum for interview plans,
learning tech etc.` People can share their interview experiences, prep plans,
resources, problems, whatever, and other people can build on top of them instead
of everything getting lost in some Reddit comment or a random GitHub repo.

I also have a few ideas to add, like a pinch of AI and a dash of MCP to make it
on par with YC startups with zero revenue. You can also comment with whatever
other features you think would be useful because, honestly, the idea is still
pretty vague. Man, Mr. Claude has had a bad influence on me; my ideas are as
vague as his. So what do we do when we have a vague idea? We think hard, iterate
over it and figure out what is actually worth building. Hell Naww, you boomer. We
ask Mr. Claude, we run a vague SWOT analysis to polish our vague idea until we
are convinced we're building the next LeetCode for AI.

Where is this series of blogs going? Honestly, I have no fucking idea. I'm
committed to building and deploying Kuma end to end, but I don't want to make
some unrealistic promise that I'm going to code every single day and publish a
blog every week. I'll try my best, but life happens and well, apparently I have
to find a job too. The idea here is more that I'll document the journey as I go.
The coming blogs will dive deeper into the architecture, tech decisions, weird
problems I might run into and different things I learn while trying to turn this
vague, raw and probably somewhat stupid idea into something that actually
works.

For the stack, I'm going to keep things pretty simple and cheap because, well,
I'm broke. The backend will run on `Cloudflare Workers, R2, D1`, blah blah. Man,
CF is just AWS with better UI. It has way too many services nobody asked for,
just like AWS. Recently they announced an Iceberg + R2 service, eventually
killing my already dead startup GaurData (gaur.run). For the backend framework I
want to use `Effect-TS`, mostly because building on an ecosystem that isn't even
stable yet feels like an accurate representation of my current mental health.
Frontend will be `Preact` and stuff. We can dig deeper into why I chose what in
the next blog maybe. And since this is going to be a technical blog, I'll try to
make sure I'm not posting AI slop. **That I can promise for the blogs.**

But for the code side of things, "Well hello Mr. DHH, I'm a huge fan". I'm not
a huge fan of blindly building an application without looking at the code and
just hoping Mr. Claude knows what the fuck he's doing. Although, to be
completely honest, I've been doing exactly that for a while now, how
hypocritical of me. For Kuma, I want to be a little more deliberate about it.
I'll obviously use AI heavily because that's kind of the whole point of building
in 2026, but I want to actually understand the code, keep it maintainable and
make sure it doesn't slowly turn into a giant pile of AI slop that nobody wants
to touch six months later. Since this is going to be open source and
community-driven (if this gets any community), the code should hopefully be
something other people can actually understand, review, contribute to and
occasionally tell me that I'm doing something incredibly stupid. So yeah that's 
pretty much it. See ya!
