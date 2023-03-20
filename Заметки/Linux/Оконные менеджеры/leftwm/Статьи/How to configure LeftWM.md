https://uaam.hashnode.dev/how-to-configure-leftwm

Today, I will walk you through my process to configure [LeftWM](http://leftwm.org/). We can find the official documentation for the configuration here:

https://github.com/leftwm/leftwm/wiki/Config

I'll assume you have LeftWM already installed in your machine.

## [](https://uaam.hashnode.dev/how-to-configure-leftwm#heading-if-the-previous-config-file-exists "Permalink")If the previous config file exists

As I already had a config file, I renamed `config.ron` to `config.ron.bak`. If you have a config file different from the default, you need to make a backup of your current file, either by renaming it as I did or with the help of version control systems like git. After securing a backup, delete the `config.ron` file and use the keybinding you had configured for `SoftReload`. The command will create a new default config file.

## [](https://uaam.hashnode.dev/how-to-configure-leftwm#heading-the-beginning "Permalink")The beginning

As I like icons instead of numbers for my tags, that it's the first thing I change. Open the config file in your preferred plain text editor, in my case, Emacs (Doom Emacs), and locate the `tags` field. It will look something like this:


```
tags: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
    ],
```

Now change it to whatever you want your tags to display. In my case, I want some icons, [these icons](https://www.nerdfonts.com/cheat-sheet) come from the [Nerd Fonts](https://www.nerdfonts.com/#home), so if you want them too, you need a [patch font](https://www.nerdfonts.com/font-downloads). Here is how the code looks and what is displayed afterward:


```
tags: [
        "\u{e745}",
        "\u{f9c6}",
        "\u{f02d}",
        "\u{e215}",
        "\u{e615}",
        "\u{f9d2}",
        "\u{f09e}",
        "\u{f670}",
        "\u{f71e}",
    ],
```

![2022-11-19_21-44.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669311504074/85bhd9ldl.png?auto=compress,format&format=webp)

## [](https://uaam.hashnode.dev/how-to-configure-leftwm#heading-layouts "Permalink")Layouts

The next thing is layouts. I'm only using three, so I delete the rest of them. Here is how it looks in this section of the file:

```
layouts: [
        MainAndVertStack,
        MainAndHorizontalStack,
        Monocle,
    ],
```

**MainAndVertStack**

![2022-11-22_16-18.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669311533103/jNKAc8Li1.png?auto=compress,format&format=webp)

**MainAndHorizontalStack**

![2022-11-22_16-19.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669311549064/fmL4jmSkU.png?auto=compress,format&format=webp)

**Monocle**

![2022-11-22_16-19_1.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669311561529/xhs7TFcsh.png?auto=compress,format&format=webp)

## [](https://uaam.hashnode.dev/how-to-configure-leftwm#heading-layout-mode "Permalink")Layout mode

I like my layouts remembered per tag instead of per workspace.

```
layout_mode: Tag
```

## [](https://uaam.hashnode.dev/how-to-configure-leftwm#heading-keybindings "Permalink")Keybindings

The next step is to configure the keybindings, for this I'll separate this section in two: LeftWM and general keybinds

### [](https://uaam.hashnode.dev/how-to-configure-leftwm#heading-leftwm-keybinds "Permalink")LeftWM keybinds

This section is about the LeftWM-specific keybinding commands. I'll link you to the [keybinds section](https://github.com/leftwm/leftwm/wiki/Config#keybind) of the docs instead of explaining every keybinding because this will depend on your preferences.

### [](https://uaam.hashnode.dev/how-to-configure-leftwm#heading-general-keybinds "Permalink")General keybinds

For the general keybindings, I use [sxhkd](https://github.com/baskerville/sxhkd). To configure it, you can read this [Arch wiki article](https://wiki.archlinux.org/title/Sxhkd) or the README file in the [official repository](https://github.com/baskerville/sxhkd).

As with the Leftwm keybindings, I won't paste the code here, but I'll link to a gist if you want to copy and paste it. Then personalize it to your needs and preferences.

## [](https://uaam.hashnode.dev/how-to-configure-leftwm#heading-scratchpads "Permalink")Scratchpads

Finally, I'll show you how I create a new scratchpad to show my keybindings. You may ask, what is a scratchpad?, the [official docs](https://github.com/leftwm/leftwm/wiki/Config#scratchpads) say the following:

> A scratchpad is a set of windows which you can call to any tag and hide it when not needed. These windows can be any set of application which can be run from a terminal.

Here is how this section looks:

```
scratchpad: [
        (name: "Alacritty", value: "alacritty",x: 60, width: 1800),
        (name: "keybindings", value: "alacritty -e glow -p ~/proyectos/Obsidian-PKM/keybindings.md", x: 60, width: 1800)
    ],
```

And how my keybindings scratchpad looks in action:

![2022-11-22_16-20.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669311594171/R0nZw8l8E.png?auto=compress,format&format=webp)

## [](https://uaam.hashnode.dev/how-to-configure-leftwm#heading-final-toughs "Permalink")Final toughs

That would be all for the day. I hope this is helpful and motivate you to modify your LeftWM configuration. I'll leave links to a gist with only my `config.ron` and to my repository, where are my LeftWM config files, `config.ron`, `sxhkd/sxhdrc`, and others. This repository doesn't include the current theme I'm using. I'll make another article on how to modify an existing one. If you want more information about any aspect of the configuration or you require help modifying your config, feel free to reach out to me.

[https://github.com/UlisesAlexanderAM/UAAM-config-leftwm](https://github.com/UlisesAlexanderAM/UAAM-config-leftwm)

