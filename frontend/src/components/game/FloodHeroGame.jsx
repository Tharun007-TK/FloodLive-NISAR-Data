import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Volume2,
  VolumeX,
  ShieldCheck,
  Heart,
  Droplets,
  Tv,
  Megaphone,
  Home,
  Waves,
  Sun,
  CloudRain,
  ChevronRight,
  HelpCircle,
  Zap,
  Radio,
  Share2
} from 'lucide-react';

// Web Audio API Sound Synthesizer for Retro Sound Effects
function createAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  return AudioCtx ? new AudioCtx() : null;
}

function playTone(type, freq, duration, gainVal = 0.15) {
  try {
    const ctx = createAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio autoplay handled
  }
}

function playWinSound() {
  playTone('triangle', 523.25, 0.12);
  setTimeout(() => playTone('triangle', 659.25, 0.15), 100);
  setTimeout(() => playTone('triangle', 783.99, 0.18), 200);
  setTimeout(() => playTone('triangle', 1046.5, 0.35, 0.2), 300);
}

function playSplashFailSound() {
  playTone('sawtooth', 220, 0.2, 0.2);
  setTimeout(() => playTone('sawtooth', 146.83, 0.3, 0.25), 150);
  setTimeout(() => playTone('sine', 98, 0.4, 0.25), 300);
}

function playAlertSound() {
  playTone('square', 880, 0.15, 0.1);
  setTimeout(() => playTone('square', 660, 0.2, 0.1), 160);
}

// Fisher-Yates array shuffler for randomizing answers
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── 20 COMPREHENSIVE SCENARIOS WITH 4 BALANCED OPTIONS EACH ─────────────────
const RAW_SCENARIOS = [
  {
    id: 1,
    badge: '🚨 LEVEL 1: IMMEDIATE EVACUATION',
    title: 'The Floodwater is Rushing Into Your Street!',
    description: 'The river has overflowed and brown water is rapidly rising around your doorstep. What is your immediate action?',
    situationArt: 'flood_arriving',
    educationalTip: '💡 Golden Rule: When floodwaters rise, seconds count! Always alert others and immediately move to designated higher ground.',
    options: [
      {
        text: 'Run to designated high ground while blowing whistle & alerting neighbours',
        sublabel: 'Shout to alert neighbours, guide family, and head to the shelter hill immediately.',
        isCorrect: true,
        reactionTitle: '⭐ HERO ACTION! YOU SAVED LIVES!',
        reactionMsg: 'Brilliant thinking! Early warning saves the entire village. You alerted Grandma and your neighbours before water trapped anyone!',
        points: 100,
        visualState: 'safe_hill',
      },
      {
        text: 'Stay on the sofa and keep watching TV cartoons',
        sublabel: 'Ignore the water and hope someone else takes care of it.',
        isCorrect: false,
        reactionTitle: '🌊 DANGER! WATER RISES IN SECONDS!',
        reactionMsg: 'Oh no! The TV flickered and water flooded the living room! In a flood, water rises dangerously fast. Never ignore early alerts!',
        points: 0,
        visualState: 'soaked_tv',
      },
      {
        text: 'Go down into the underground basement to lock storage rooms',
        sublabel: 'Try to save old toys and boxes in the basement.',
        isCorrect: false,
        reactionTitle: '⚠️ BASEMENT TRAP HAZARD!',
        reactionMsg: 'Basements fill first with zero escape route! Never enter basements or underground parking lots during floods!',
        points: 0,
        visualState: 'soaked_tv',
      },
      {
        text: 'Wade through the swift water to the local market to buy snacks',
        sublabel: 'Walk through brown water to grab treats.',
        isCorrect: false,
        reactionTitle: '⛔ SWEPT AWAY BY CURRENTS!',
        reactionMsg: 'Just 6 inches of rushing water can sweep an adult off their feet. Never walk into flooded streets!',
        points: 0,
        visualState: 'soaked_tv',
      }
    ]
  },
  {
    id: 2,
    badge: '💧 LEVEL 2: SAFE DRINKING WATER',
    title: 'You Are Thirsty During a Flood!',
    description: 'Taps have stopped running, but there is water everywhere outside. Where should you drink from?',
    situationArt: 'thirsty_watercan',
    educationalTip: '💡 Health Rule: Floodwater is toxic. Always drink stored sealed watercans, boiled water, or use water purification tablets.',
    options: [
      {
        text: 'Drink only from clean sealed watercans or properly boiled water',
        sublabel: 'Use stored clean drinking water or purified bottled water containers.',
        isCorrect: true,
        reactionTitle: '🛡️ SUPER HEALTH CHOICE!',
        reactionMsg: 'Great job! Floodwater carries harmful bacteria, sewage, and chemicals. Stored sealed water keeps you strong and infection-free!',
        points: 100,
        visualState: 'safe_watercan',
      },
      {
        text: 'Scoop water from the street puddle because it came from the sky',
        sublabel: 'Assume rainwater in the road is clean enough to drink.',
        isCorrect: false,
        reactionTitle: '⚠️ SEVERE SICKNESS RISK!',
        reactionMsg: 'Floodwater is heavily contaminated with cholera, sewage, and hazardous debris. Drinking it can make you severely ill!',
        points: 0,
        visualState: 'muddy_puddle',
      },
      {
        text: 'Drink water directly from the submerged kitchen tap',
        sublabel: 'Assume pipe water is clean even if pipes are underwater.',
        isCorrect: false,
        reactionTitle: '🤢 PIPE CONTAMINATION HAZARD!',
        reactionMsg: 'Floodwaters infiltrate damaged water mains and contaminate household pipes with mud and bacteria!',
        points: 0,
        visualState: 'muddy_puddle',
      },
      {
        text: 'Drink rainwater flowing down rusty corrugated metal roofs',
        sublabel: 'Catch rainwater dripping from rusty gutters.',
        isCorrect: false,
        reactionTitle: '🦠 TOXIC RUNOFF HAZARD!',
        reactionMsg: 'Roof runoff contains bird droppings, heavy metals, and mold. Never drink unfiltered roof runoff!',
        points: 0,
        visualState: 'muddy_puddle',
      }
    ]
  },
  {
    id: 3,
    badge: '⚡ LEVEL 3: ELECTRICAL HAZARDS',
    title: 'Water is Reaching Wall Sockets and Extension Cords!',
    description: 'Floodwater has crept inside the hallway and is reaching electrical wall plugs. What must be done?',
    situationArt: 'electrical_box',
    educationalTip: '💡 Electrical Safety: Turn off the main circuit breaker from a dry spot before floodwaters reach wall sockets. Never touch wires in water!',
    options: [
      {
        text: 'Turn off the main circuit breaker with an adult from dry ground',
        sublabel: 'Shut down the home electrical supply before water touches sockets.',
        isCorrect: true,
        reactionTitle: '⚡ ELECTROCUTION PREVENTED!',
        reactionMsg: 'Genius move! Water conducts high-voltage electricity instantly. Switching off the main breaker prevented an electrical fire and shock!',
        points: 100,
        visualState: 'safe_breaker',
      },
      {
        text: 'Plug in your phone charger while standing barefoot in the puddle',
        sublabel: 'Try to quickly charge your phone before power cuts off.',
        isCorrect: false,
        reactionTitle: '💥 SEVERE ELECTRIC SHOCK HAZARD!',
        reactionMsg: 'Danger! Never touch electrical plugs, cords, or switches when standing in water! Electricity will shock you instantly!',
        points: 0,
        visualState: 'sparks_breaker',
      },
      {
        text: 'Throw a wet bath towel over the sparking wall socket',
        sublabel: 'Try to smother sparks with wet cloth.',
        isCorrect: false,
        reactionTitle: '🔥 WET CLOTH CONDUCTS ELECTRICITY!',
        reactionMsg: 'Wet cloth conducts current directly to your body and causes explosive sparks! Only switch off the main breaker from dry ground!',
        points: 0,
        visualState: 'sparks_breaker',
      },
      {
        text: 'Touch the submerged wires with a metal spoon to check current',
        sublabel: 'Test if the electrical wire is live.',
        isCorrect: false,
        reactionTitle: '⚡ LETHAL SHOCK DANGER!',
        reactionMsg: 'Metal is a prime electrical conductor. Touching submerged wires with metal is lethal!',
        points: 0,
        visualState: 'sparks_breaker',
      }
    ]
  },
  {
    id: 4,
    badge: '🌪️ LEVEL 4: COASTAL CYCLONE STORM SURGE',
    title: 'A Coastal Storm Surge is Pushing 10-Foot Waves!',
    description: 'A severe cyclone warning was issued for the coast. Heavy gale winds and giant tidal waves are approaching.',
    situationArt: 'cyclone_shelter',
    educationalTip: '💡 Coastal Rule: Storm surges travel faster than a person can run. Always heed official evacuation notices and move inland to designated shelters.',
    options: [
      {
        text: 'Evacuate early to the concrete cyclone shelter on high ground',
        sublabel: 'Put on lifejackets and move inward to reinforced multi-story shelters.',
        isCorrect: true,
        reactionTitle: '🏆 CYCLONE SAFEGUARD ACHIEVED!',
        reactionMsg: 'Outstanding! Engineered cyclone shelters are built on stilts to withstand massive waves and 150 km/h winds. You and your community are protected!',
        points: 100,
        visualState: 'safe_shelter',
      },
      {
        text: 'Run to the beach barrier to take selfies and film the giant waves',
        sublabel: 'Take selfies and videos near the sea barrier for social media.',
        isCorrect: false,
        reactionTitle: '🌊 FATAL RISK! TSUNAMI / SURGE DANGER!',
        reactionMsg: 'Stop! Coastal storm surges can sweep you away in milliseconds without any warning. Never visit beaches or seawalls during storm warnings!',
        points: 0,
        visualState: 'beach_danger',
      },
      {
        text: 'Hide under a thatched straw umbrella on the beachfront',
        sublabel: 'Wait out the cyclone near the shore under umbrella shade.',
        isCorrect: false,
        reactionTitle: '🌪️ SHED BLOWN AWAY BY WINDS!',
        reactionMsg: 'Lightweight thatched huts are torn apart by hurricane-force winds. Only reinforced concrete shelters provide real safety!',
        points: 0,
        visualState: 'beach_danger',
      },
      {
        text: 'Take a small wooden paddle boat out into the ocean waves to surf',
        sublabel: 'Try to paddle against the cyclone swells.',
        isCorrect: false,
        reactionTitle: '⛵ BOAT CAPSIZED INSTANTLY!',
        reactionMsg: 'Turbulent ocean storm surges smash boats against rocks instantly. Never go into coastal waters during a storm warning!',
        points: 0,
        visualState: 'beach_danger',
      }
    ]
  },
  {
    id: 5,
    badge: '🚁 LEVEL 5: ROOFTOP RESCUE & SIGNALING',
    title: 'Trapped on the Roof Surrounded by Deep Water!',
    description: 'You and your family are safely on the roof, and a rescue helicopter or boat is searching in the distance.',
    situationArt: 'rooftop_signaling',
    educationalTip: '💡 Rescue Rule: Six inches of rushing water can sweep you off your feet. Stay on high ground, stay visible with bright colors, and signal!',
    options: [
      {
        text: 'Wave a bright orange cloth, use a mirror reflector, and blow a whistle',
        sublabel: 'Stay visible on the highest secure point and signal rescue teams.',
        isCorrect: true,
        reactionTitle: '🎉 RESCUE COMPLETE! YOU ARE A HERO!',
        reactionMsg: 'Hooray! The rescue pilots spotted your bright signaling flag and heard the whistle! The boat steered straight to your roof!',
        points: 100,
        visualState: 'rescued_helicopter',
      },
      {
        text: 'Dive into the raging brown water to swim across to the boat',
        sublabel: 'Try to swim through brown debris-filled torrents.',
        isCorrect: false,
        reactionTitle: '⛔ CURRENT IS TOO STRONG! NEVER SWIM!',
        reactionMsg: 'Rushing floodwater hides tree branches, underwater cables, and open drains. Even strong swimmers drown in flood currents. Stay on the roof and signal!',
        points: 0,
        visualState: 'swimming_danger',
      },
      {
        text: 'Hide inside the closed attic space without an exit hatch to the roof',
        sublabel: 'Climb into attic and close the ceiling trapdoor.',
        isCorrect: false,
        reactionTitle: '⚠️ TRAPPED WITHOUT ESCAPE!',
        reactionMsg: 'If water fills the attic, there is no way out! Always go on TOP of the roof with an axe/rope so rescue boats can see you!',
        points: 0,
        visualState: 'swimming_danger',
      },
      {
        text: 'Throw heavy clay roof tiles into the water to make noise',
        sublabel: 'Smash roof tiles into the current to attract attention.',
        isCorrect: false,
        reactionTitle: '🔨 ROOF COLLAPSE RISK!',
        reactionMsg: 'Damaging roof tiles weakens the structure and makes rescue footing treacherous. Use whistles and bright flags instead!',
        points: 0,
        visualState: 'swimming_danger',
      }
    ]
  },
  {
    id: 6,
    badge: '🎒 LEVEL 6: EMERGENCY DISASTER GO-BAG',
    title: 'Packing Your Family Disaster Go-Bag!',
    description: 'You have only 3 minutes to pack a backpack before flood evacuation. What should you pack?',
    situationArt: 'gobag_pack',
    educationalTip: '💡 Go-Bag Essentials: Keep a ready disaster backpack with drinking water, dry food, whistle, flashlight, power bank, and basic medicines.',
    options: [
      {
        text: 'Flashlight, whistle, dry biscuits, water bottle, first aid kit & power bank',
        sublabel: 'Lightweight survival essentials packed inside waterproof plastic pouches.',
        isCorrect: true,
        reactionTitle: '⭐ SURVIVAL MASTER PACKER!',
        reactionMsg: 'Perfect preparation! An emergency kit keeps you fed, hydrated, and able to signal for help for 72 hours!',
        points: 100,
        visualState: 'safe_gobag',
      },
      {
        text: 'Heavy gaming console, television remotes, and board games',
        sublabel: 'Pack entertainment items that fill up the whole bag.',
        isCorrect: false,
        reactionTitle: '📦 TOO HEAVY & NO SURVIVAL VALUE!',
        reactionMsg: 'Oh no! Heavy toys will slow you down and get ruined by water. Always prioritize food, clean water, first aid, and light!',
        points: 0,
        visualState: 'heavy_toys',
      },
      {
        text: 'Raw frozen meat and heavy glass jars of jam',
        sublabel: 'Pack perishable foods that spoil quickly without power.',
        isCorrect: false,
        reactionTitle: '🥩 MEAT SPOILS & GLASS SHATTERS!',
        reactionMsg: 'Glass jars break easily and raw meat spoils without refrigerators. Pack dry biscuits, energy bars, and nuts instead!',
        points: 0,
        visualState: 'heavy_toys',
      },
      {
        text: 'Cast iron cookware and decorative brass statues',
        sublabel: 'Pack heavy kitchen metals to protect them.',
        isCorrect: false,
        reactionTitle: '🏋️ BACKPACK TOO HEAVY TO CARRY!',
        reactionMsg: 'Heavy metal slows evacuation to a crawl. In an emergency, mobility and speed save lives!',
        points: 0,
        visualState: 'heavy_toys',
      }
    ]
  },
  {
    id: 7,
    badge: '🚗 LEVEL 7: FLOODED ROADS & DRIVING',
    title: 'A Moving Stream Across the Roadway!',
    description: 'Your family vehicle approaches a flooded dip in the road. The water looks only 1 foot deep.',
    situationArt: 'car_turnaround',
    educationalTip: '💡 Vehicle Rule: "Turn Around, Don\'t Drown!" More than half of all flood-related drownings occur in vehicles trying to cross flooded roads.',
    options: [
      {
        text: '"Turn Around, Don\'t Drown!" Stop, reverse, and seek higher unflooded ground',
        sublabel: 'Stop immediately, reverse, and seek higher unflooded ground.',
        isCorrect: true,
        reactionTitle: '🚘 SAFE MOTORING HERO!',
        reactionMsg: 'Smart choice! Just 12 inches of rushing water can float a car, stall the engine, and sweep it downstream into deep rivers!',
        points: 100,
        visualState: 'safe_turnaround',
      },
      {
        text: 'Speed up and drive through hoping momentum carries you across',
        sublabel: 'Try to splash across before the water gets deeper.',
        isCorrect: false,
        reactionTitle: '🌊 CAR ENGINE STALLED & FLOATED AWAY!',
        reactionMsg: 'Dangerous! Most flood deaths happen inside trapped vehicles. The road underneath may have washed away completely!',
        points: 0,
        visualState: 'car_stalled',
      },
      {
        text: 'Get out into the rushing water to push the car across by hand',
        sublabel: 'Step into the moving stream to push.',
        isCorrect: false,
        reactionTitle: '⛔ SWEPT UNDER VEHICLE!',
        reactionMsg: 'Rushing currents knock people off their feet and sweep them under wheels or open road culverts! Stay inside and turn around!',
        points: 0,
        visualState: 'car_stalled',
      },
      {
        text: 'Park inside the flooded dip and wait with all windows rolled up',
        sublabel: 'Wait inside the low flooded spot.',
        isCorrect: false,
        reactionTitle: '⚠️ WATER PRESSURE PINS DOORS SHUT!',
        reactionMsg: 'Water pressure from outside prevents doors from opening as water submerges the vehicle! Always reverse to high ground!',
        points: 0,
        visualState: 'car_stalled',
      }
    ]
  },
  {
    id: 8,
    badge: '🐾 LEVEL 8: FAMILY PET SAFETY',
    title: 'Your Dog and Cat are Trapped Outside in the Yard!',
    description: 'Water is rising into the garden where pets are resting. How should you evacuate your pets?',
    situationArt: 'pet_rescue',
    educationalTip: '💡 Pet Care: Never leave pets tied up or trapped. Prepare a pet carrier with leash, food, and identification tags.',
    options: [
      {
        text: 'Bring them inside, secure in carriers or leashes, and evacuate together',
        sublabel: 'Ensure pets are secured in carriers or leashes and take dry pet food.',
        isCorrect: true,
        reactionTitle: '🐶 HERO ANIMAL RESCUER!',
        reactionMsg: 'Wonderful compassion! Pets are family too. Securing them in carriers ensures they do not panic or get swept away by currents!',
        points: 100,
        visualState: 'safe_pets',
      },
      {
        text: 'Leave them chained to a fence or tree in the yard',
        sublabel: 'Assume animals can swim through any floodwaters.',
        isCorrect: false,
        reactionTitle: '😢 PETS WILL DROWN IF TIED UP!',
        reactionMsg: 'Heartbreaking mistake! Chained animals cannot escape rising waters. Never leave pets tied up during a disaster!',
        points: 0,
        visualState: 'pet_danger',
      },
      {
        text: 'Lock pets inside the ground-level garden shed',
        sublabel: 'Lock them in the shed to keep them dry.',
        isCorrect: false,
        reactionTitle: '🚪 TRAPPED BEHIND WATER-LOCKED DOOR!',
        reactionMsg: 'Water floods sheds quickly, trapping pets inside with no air. Always bring them with you in secure carriers!',
        points: 0,
        visualState: 'pet_danger',
      },
      {
        text: 'Chase them out into the flooded street to run on their own',
        sublabel: 'Let pets loose into the flood torrents.',
        isCorrect: false,
        reactionTitle: '🌊 PETS SWEPT DOWNSTREAM BY CURRENTS!',
        reactionMsg: 'Terrified pets get disoriented and swept into drainage pipes. Keep them secured on leashes and inside carriers!',
        points: 0,
        visualState: 'pet_danger',
      }
    ]
  },
  {
    id: 9,
    badge: '⚡ LEVEL 9: DOWNED POWER LINES',
    title: 'A Broken Electrical Wire has Fallen on the Wet Road!',
    description: 'A storm snapped a power line and it is sparking in a large puddle in front of you.',
    situationArt: 'downed_wire',
    educationalTip: '💡 Wire Danger: Always treat all downed wires as live and lethal. Stay back at least 30 feet (10 meters) and call 112 immediately.',
    options: [
      {
        text: 'Stay back at least 30 feet (10 meters), warn others, and call 112',
        sublabel: 'Keep everyone far away and wait for professional utility crews.',
        isCorrect: true,
        reactionTitle: '⚡ HIGH-VOLTAGE SAFETY HERO!',
        reactionMsg: 'Excellent awareness! Electricity spreads through wet asphalt and puddles. Keeping a wide 30-foot perimeter prevents death!',
        points: 100,
        visualState: 'safe_wire',
      },
      {
        text: 'Try to jump over the sparking wire using rubber sole shoes',
        sublabel: 'Think that shoes will insulate you from live cables.',
        isCorrect: false,
        reactionTitle: '💥 LETHAL ARC FLASH RISK!',
        reactionMsg: 'Fatal danger! High-voltage electricity jumps through air and wet shoes easily. Never approach downed wires!',
        points: 0,
        visualState: 'wire_danger',
      },
      {
        text: 'Use a long fallen tree branch to push the wire off the road',
        sublabel: 'Try to clear the wire with wood.',
        isCorrect: false,
        reactionTitle: '⚡ WET WOOD CONDUCTS ELECTRICITY!',
        reactionMsg: 'Storm tree branches are soaked with rainwater and conduct lethal current straight into your hands! Stay away!',
        points: 0,
        visualState: 'wire_danger',
      },
      {
        text: 'Pour water over the sparking wire to extinguish the electrical sparks',
        sublabel: 'Try to put out the sparks with a bucket of water.',
        isCorrect: false,
        reactionTitle: '💥 EXPLOSIVE ARCING & ELECTROCUTION!',
        reactionMsg: 'Water accelerates electrical short-circuits and creates explosive plasma arcs! Never throw water on electrical lines!',
        points: 0,
        visualState: 'wire_danger',
      }
    ]
  },
  {
    id: 10,
    badge: '📄 LEVEL 10: PROTECTING ESSENTIAL DOCUMENTS',
    title: 'Important Government IDs, Certificates & Medical Papers!',
    description: 'Water is entering the house and important papers (birth certificates, IDs, land records) need protection.',
    situationArt: 'waterproof_pouch',
    educationalTip: '💡 Document Protection: Store essential birth certificates, land papers, and IDs in waterproof pouches and back up digital scans on your phone.',
    options: [
      {
        text: 'Seal documents in waterproof zipper pouches inside your backpack',
        sublabel: 'Keep originals dry and take photos on your smartphone stored in cloud.',
        isCorrect: true,
        reactionTitle: '📋 DOCUMENT SECURITY MASTER!',
        reactionMsg: 'Outstanding! Having dry ID cards and records makes relief compensation, medical care, and rebuilding fast and seamless!',
        points: 100,
        visualState: 'safe_documents',
      },
      {
        text: 'Leave them in the bottom wooden drawer under the desk',
        sublabel: 'Assume the desk is heavy enough to resist water.',
        isCorrect: false,
        reactionTitle: '🌊 PAPERS DESTROYED & TURNED TO MUD!',
        reactionMsg: 'Oh no! Soaked paper turns to pulp and ink bleeds away. Without IDs, proving identity and receiving aid becomes very difficult!',
        points: 0,
        visualState: 'papers_soaked',
      },
      {
        text: 'Tape papers loosely to the outside of the front door',
        sublabel: 'Tape papers where they can be seen.',
        isCorrect: false,
        reactionTitle: '🌧️ WASHED AWAY BY MONSOON RAIN!',
        reactionMsg: 'Rain and wind will shred paper taped outdoors within minutes. Always seal papers inside waterproof zipper bags in your go-bag!',
        points: 0,
        visualState: 'papers_soaked',
      },
      {
        text: 'Hide papers under the damp floor welcome mat',
        sublabel: 'Place them on the ground under a rug.',
        isCorrect: false,
        reactionTitle: '💩 SOAKED IN MUD AND SEWAGE!',
        reactionMsg: 'Floor mats soak up dirty floodwater instantly. Store all important documents high up in waterproof containers!',
        points: 0,
        visualState: 'papers_soaked',
      }
    ]
  },
  {
    id: 11,
    badge: '🍎 LEVEL 11: FOOD SAFETY AFTER FLOOD',
    title: 'Food Floating in Floodwater in the Kitchen!',
    description: 'Floodwaters entered the pantry. Apples, boxed cereal, and canned soup were submerged in dirty floodwater.',
    situationArt: 'food_safety',
    educationalTip: '💡 Food Sanitation: When in doubt, throw it out! Discard all unpackaged food, screw-cap bottles, and cardboard boxes that contacted floodwater.',
    options: [
      {
        text: 'Throw away any food or fruit that touched floodwater; only disinfect sealed metal cans',
        sublabel: 'Only undamaged metal cans can be disinfected before opening; throw out everything else.',
        isCorrect: true,
        reactionTitle: '🥗 INFECTION PREVENTED!',
        reactionMsg: 'Smart move! Floodwater carries sewage microbes that penetrate fruit peels and cardboard boxes. Discarding contaminated food prevents severe illness!',
        points: 100,
        visualState: 'safe_canned_food',
      },
      {
        text: 'Rinse the apples in street floodwater and eat them raw',
        sublabel: 'Assume wiping on clothes makes it clean.',
        isCorrect: false,
        reactionTitle: '🤢 SEVERE BACTERIAL POISONING!',
        reactionMsg: 'Gross and dangerous! Floodwater contains industrial runoff and raw sewage. Eating food touched by it causes dangerous gastrointestinal infections!',
        points: 0,
        visualState: 'contaminated_food',
      },
      {
        text: 'Microwave soggy cardboard boxes of cereal for 10 seconds to dry them',
        sublabel: 'Heat cereal up in microwave to kill dirt.',
        isCorrect: false,
        reactionTitle: '🦠 TOXINS SURVIVE MICROWAVES!',
        reactionMsg: 'Cardboard absorbs chemical runoff and bacteria toxins that are not destroyed by quick heating. Discard soaked packaging!',
        points: 0,
        visualState: 'contaminated_food',
      },
      {
        text: 'Scrape the mud off soaked cookies with a butter knife and eat',
        sublabel: 'Just scrape off the top layer of dirt.',
        isCorrect: false,
        reactionTitle: '⚠️ INTERNAL BACTERIAL INFECTION!',
        reactionMsg: 'Floodwater bacteria soak right through porous cookies. When in doubt, throw it out!',
        points: 0,
        visualState: 'contaminated_food',
      }
    ]
  },
  {
    id: 12,
    badge: '🧱 LEVEL 12: RIVER EMBANKMENT INTEGRITY',
    title: 'Watching the Swollen River from the Muddy Bank!',
    description: 'The river is raging at maximum level and muddy river banks are visibly eroding and trembling.',
    situationArt: 'river_bank',
    educationalTip: '💡 Bank Caution: Saturated riverbanks suffer sudden catastrophic collapse. Always maintain a minimum 50-foot safety buffer from riverbanks.',
    options: [
      {
        text: 'Stay far back on solid pavement away from the crumbling bank',
        sublabel: 'Never stand near riverbanks during floods as ground undercuts collapse.',
        isCorrect: true,
        reactionTitle: '🛡️ EMBANKMENT COLLAPSE AVOIDED!',
        reactionMsg: 'Terrific observation! Swirling river eddies scoop away soil from underneath the riverbank. Seconds later, a 20-foot chunk caved into the river!',
        points: 100,
        visualState: 'safe_distance_bank',
      },
      {
        text: 'Stand on the very edge to dip your feet into the raging water',
        sublabel: 'Feel how fast the water is moving.',
        isCorrect: false,
        reactionTitle: '💥 GROUND COLLAPSED UNDERFOOT!',
        reactionMsg: 'Horrifying! The muddy bank gave way instantly. Never stand near swollen river edges!',
        points: 0,
        visualState: 'collapsing_bank',
      },
      {
        text: 'Ride your bicycle quickly along the narrow muddy crest of the river dike',
        sublabel: 'Ride bike on the edge for excitement.',
        isCorrect: false,
        reactionTitle: '🚲 SLIPPED INTO RAGING RIVER!',
        reactionMsg: 'Wet mud causes tires to slip instantly into deep torrents. Stay away from flooded riverbanks!',
        points: 0,
        visualState: 'collapsing_bank',
      },
      {
        text: 'Poke deep holes in the soft embankment with wooden sticks',
        sublabel: 'Play in the mud wall.',
        isCorrect: false,
        reactionTitle: '⚠️ WEAKENED FLOOD DIKE INTEGRITY!',
        reactionMsg: 'Poking holes weakens flood dikes and triggers water seepage that can burst the entire levee!',
        points: 0,
        visualState: 'collapsing_bank',
      }
    ]
  },
  {
    id: 13,
    badge: '📞 LEVEL 13: DISASTER HOTLINES & SOS',
    title: 'Someone in the Neighbourhood Needs Immediate Medical Help!',
    description: 'An elder has slipped and needs emergency rescue while water is blocking the streets.',
    situationArt: 'emergency_112',
    educationalTip: '💡 Emergency Hotlines: In India, dial 112 for All-in-One Emergency, 108 for Ambulance, and 1070 for State Disaster Management Control Room.',
    options: [
      {
        text: 'Dial 112 (National Emergency) / 108 (Ambulance) & give exact pinpoint GPS',
        sublabel: 'Clearly state your location, number of trapped people, and landmark.',
        isCorrect: true,
        reactionTitle: '🚑 RESCUE BOAT DISPATCHED!',
        reactionMsg: 'Super efficient! Professional NDRF/SDRF rescue boat teams were dispatched straight to your exact coordinates with paramedics onboard!',
        points: 100,
        visualState: 'safe_rescue_called',
      },
      {
        text: 'Post a panic meme on social media and wait for likes',
        sublabel: 'Hope random internet users will see it and help.',
        isCorrect: false,
        reactionTitle: '⏱️ WASTED CRITICAL MINUTES!',
        reactionMsg: 'Emergency response teams monitor 112 dispatch channels, not social media feeds! Always call verified helpline numbers directly!',
        points: 0,
        visualState: 'selfie_danger',
      },
      {
        text: 'Forward panic voice notes to 50 random chat groups',
        sublabel: 'Forward rumors asking people to share widely.',
        isCorrect: false,
        reactionTitle: '📢 SPREADS RUMORS & BLOCKS LINES!',
        reactionMsg: 'Chain forwarding creates panic and clogs emergency networks without alerting actual local rescue teams. Call 112 directly!',
        points: 0,
        visualState: 'selfie_danger',
      },
      {
        text: 'Wait for 3 days until water recedes completely before telling anyone',
        sublabel: 'Keep quiet and hope someone visits.',
        isCorrect: false,
        reactionTitle: '🏥 MEDICAL EMERGENCY DELAYED!',
        reactionMsg: 'Injuries need rapid medical treatment. Always call official emergency hotlines immediately!',
        points: 0,
        visualState: 'selfie_danger',
      }
    ]
  },
  {
    id: 14,
    badge: '⏳ LEVEL 14: DOORWAY BARRIERS & SANDBAGS',
    title: 'Water Creeping Up the Front Pathway Toward the Door!',
    description: 'You have 30 minutes before street runoff reaches floor height. How do you protect the door threshold?',
    situationArt: 'sandbag_door',
    educationalTip: '💡 Sandbag Strategy: Fill sandbags only 2/3 full, fold over the top, and stack them in interlocking rows like bricks over waterproof plastic sheeting.',
    options: [
      {
        text: 'Stack sandbags in a staggered pyramid tightly against plastic sheeting',
        sublabel: 'Lay plastic tarp and overlap sandbags like bricks to seal out water.',
        isCorrect: true,
        reactionTitle: '🏰 IMPENETRABLE FLOOD DIKE!',
        reactionMsg: 'Brilliant engineering! Staggered sandbags coupled with polyethylene plastic film created a waterproof barrier that stopped muddy water completely!',
        points: 100,
        visualState: 'safe_sandbags',
      },
      {
        text: 'Prop up a thin cardboard packing box in front of the door',
        sublabel: 'Hope cardboard will hold back thousands of gallons of water.',
        isCorrect: false,
        reactionTitle: '📦 CARDBOARD DISINTEGRATED IN 5 SECONDS!',
        reactionMsg: 'Water pressure tore through cardboard immediately! Water is heavy and powerful. Proper sandbags and plastic barriers are needed!',
        points: 0,
        visualState: 'cardboard_fail',
      },
      {
        text: 'Lay down bedroom cotton bedsheets and bath towels across the doorway',
        sublabel: 'Expect towels to absorb all floodwaters.',
        isCorrect: false,
        reactionTitle: '🌊 TOWELS OVERWHELMED IN SECONDS!',
        reactionMsg: 'Towels only soak a few liters and become soggy sponges that let floodwaters pour in. Sandbags with plastic tarps are essential!',
        points: 0,
        visualState: 'cardboard_fail',
      },
      {
        text: 'Pour loose dry sand on the porch floor without any bags',
        sublabel: 'Dump loose sand pile in front of the door.',
        isCorrect: false,
        reactionTitle: '🏖️ LOOSE SAND WASHED AWAY AS MUD!',
        reactionMsg: 'Loose sand washes away with the first wave! Sand must be packed inside heavy woven polypropylene sandbags!',
        points: 0,
        visualState: 'cardboard_fail',
      }
    ]
  },
  {
    id: 15,
    badge: '🏫 LEVEL 15: FLOODING DURING SCHOOL HOURS',
    title: 'Extreme Downpour Floods the School Grounds!',
    description: 'During class, the school courtyard turns into a fast-moving lake and the bell rings.',
    situationArt: 'school_upper_floor',
    educationalTip: '💡 School Safety: Stay calm, obey teachers, move to upper floors, and never attempt to walk through flooded schoolyards unsupervised.',
    options: [
      {
        text: 'Follow teacher guidance & move calmly to upper-floor classrooms',
        sublabel: 'Wait inside high rooms until official school evacuation buses or rescue boats arrive.',
        isCorrect: true,
        reactionTitle: '🎓 SMART STUDENT LEADER!',
        reactionMsg: 'Outstanding discipline! Calm evacuation to higher floors prevents stampedes and keeps all students safe and accounted for!',
        points: 100,
        visualState: 'safe_classroom',
      },
      {
        text: 'Sprint outside to splash and swim in the flooded storm drains',
        sublabel: 'Play water games in the playground storm channel.',
        isCorrect: false,
        reactionTitle: '⛔ SUCKED INTO STORM DRAIN DANGER!',
        reactionMsg: 'Horrifying hazard! Open storm drains create whirlpool suction that can drag children underground. Never play near flood drains!',
        points: 0,
        visualState: 'drain_danger',
      },
      {
        text: 'Hide alone inside the dark basement boiler room',
        sublabel: 'Sneak away to hide in the basement.',
        isCorrect: false,
        reactionTitle: '⚠️ BASEMENT FLOOD TRAP!',
        reactionMsg: 'Basements flood first with no emergency exits. Always stay with your teacher and classmates on upper floors!',
        points: 0,
        visualState: 'drain_danger',
      },
      {
        text: 'Climb a wet metal flagpole in the courtyard during lightning',
        sublabel: 'Climb flagpole to stay above water level.',
        isCorrect: false,
        reactionTitle: '⚡ LIGHTNING STRIKE HAZARD!',
        reactionMsg: 'Metal flagpoles attract lightning strikes during heavy storms. Stay indoors on high floors!',
        points: 0,
        visualState: 'drain_danger',
      }
    ]
  },
  {
    id: 16,
    badge: '🌙 LEVEL 16: MIDNIGHT FLOOD ALERT',
    title: 'Siren Sounds at 2:00 AM While Everyone is Asleep!',
    description: 'The village dam overflow siren blares in the middle of the night while heavy rain drums on the roof.',
    situationArt: 'night_warning',
    educationalTip: '💡 Nighttime Preparedness: Keep a flashlight and whistle beside your bed during heavy monsoon warnings. Never ignore nighttime alarms.',
    options: [
      {
        text: 'Wake up family immediately, grab go-bag & flashlight, and move to shelter',
        sublabel: 'Quickly alert parents and siblings, put on sturdy shoes, and move to shelter.',
        isCorrect: true,
        reactionTitle: '⭐ NIGHTTIME RESCUE CHAMPION!',
        reactionMsg: 'Quick reflex! Waking the family before water enters the bedrooms gave everyone enough time to walk to the designated emergency relief camp!',
        points: 100,
        visualState: 'safe_night_evac',
      },
      {
        text: 'Put on noise-cancelling headphones and go back to sleep',
        sublabel: 'Think that sirens are just false tests.',
        isCorrect: false,
        reactionTitle: '🌊 WOKE UP TRAPPED IN 4 FEET OF WATER!',
        reactionMsg: 'Disaster! Night sirens are only sounded in genuine emergency dam releases. Sleeping through warnings leaves no escape route!',
        points: 0,
        visualState: 'headphones_danger',
      },
      {
        text: 'Go back to bed and wait until water touches your bed mattress',
        sublabel: 'Wait until the last second.',
        isCorrect: false,
        reactionTitle: '⚠️ TRAPPED BY RAPID WATER RISE!',
        reactionMsg: 'By the time water touches your bed, doors may be pinned shut by water pressure outside! Evacuate immediately when the siren sounds!',
        points: 0,
        visualState: 'headphones_danger',
      },
      {
        text: 'Open all front windows and patio doors to let night air in',
        sublabel: 'Open doors to see if water is coming.',
        isCorrect: false,
        reactionTitle: '🌊 WATER SURGED INTO BEDROOMS!',
        reactionMsg: 'Opening low doors lets floodwaters rush into the house at high velocity. Alert your family and head to high ground!',
        points: 0,
        visualState: 'headphones_danger',
      }
    ]
  },
  {
    id: 17,
    badge: '🏠 LEVEL 17: RETURNING HOME AFTER WATER SUBSIDES',
    title: 'Floodwaters Have Drained Away — Time to Check the House!',
    description: 'The flood has receded, leaving behind wet mud and damp walls. How should you enter the house?',
    situationArt: 'reentry_inspect',
    educationalTip: '💡 Post-Flood Re-entry: Never enter a damaged building until certified safe. Use flashlights (not matches), beware of snakes, and keep electrical mains off.',
    options: [
      {
        text: 'Wear boots, let adults inspect for cracked walls & wildlife, keep electricity OFF',
        sublabel: 'Open doors and windows for ventilation, check for snakes, and keep electricity OFF.',
        isCorrect: true,
        reactionTitle: '🔍 THOROUGH SAFETY INSPECTOR!',
        reactionMsg: 'Wise choice! Floods displace snakes, scorpions, and weaken building foundations. Careful inspection keeps everyone injury-free!',
        points: 100,
        visualState: 'safe_ventilated',
      },
      {
        text: 'Run in barefoot and turn on all wet light switches and fans',
        sublabel: 'Turn on fans to dry the mud immediately.',
        isCorrect: false,
        reactionTitle: '💥 ELECTRICAL SHOCK & HIDDEN SNAKE BITE!',
        reactionMsg: 'Danger! Waterlogged wiring shorts out and causes fires. Venomous snakes often seek shelter in damp corners after floods!',
        points: 0,
        visualState: 'switch_spark',
      },
      {
        text: 'Light matches and gas lighters inside to look around the dark hallway',
        sublabel: 'Use candles or matches for light.',
        isCorrect: false,
        reactionTitle: '🔥 GAS LEAK EXPLOSION RISK!',
        reactionMsg: 'Floods rupture underground gas pipelines. A single spark or match flame can trigger a catastrophic gas explosion! Always use flashlights!',
        points: 0,
        visualState: 'switch_spark',
      },
      {
        text: 'Lie down on the damp muddy sofa and take a long nap',
        sublabel: 'Rest on the wet furniture.',
        isCorrect: false,
        reactionTitle: '🦠 TOXIC MOLD & PARASITE EXPOSURE!',
        reactionMsg: 'Wet furniture harbors toxic black mold and sewage parasites. Keep wet furniture outside to sanitize and dry!',
        points: 0,
        visualState: 'switch_spark',
      }
    ]
  },
  {
    id: 18,
    badge: '🧼 LEVEL 18: HYGIENE & HANDWASHING IN CAMPS',
    title: 'Dinner Time at the Flood Evacuation Relief Shelter!',
    description: 'Food is being served at the community hall shelter. How should you prepare before eating?',
    situationArt: 'hygiene_wash',
    educationalTip: '💡 Sanitation Priority: In shelters and flood zones, wash hands frequently with soap and clean water to avoid epidemics.',
    options: [
      {
        text: 'Wash hands thoroughly with soap and clean water or use alcohol sanitizer for 20 seconds',
        sublabel: 'Thoroughly scrub fingers and palms for 20 seconds before touching food.',
        isCorrect: true,
        reactionTitle: '🧼 GERMS DEFEATED! 100% CLEAN!',
        reactionMsg: 'Outstanding! Good hygiene in relief shelters prevents dysentery and waterborne outbreaks from spreading among families!',
        points: 100,
        visualState: 'safe_sanitized',
      },
      {
        text: 'Dip hands in the muddy standing puddle outside the camp to rinse',
        sublabel: 'Assume rinsing off visible dirt is enough.',
        isCorrect: false,
        reactionTitle: '🦠 HARMFUL PATHOGENS INGESTED!',
        reactionMsg: 'Sickening! Standing water puddles contain thousands of microscopic bacteria and parasite eggs. Always use clean soap and safe water!',
        points: 0,
        visualState: 'dirty_hands',
      },
      {
        text: 'Wipe hands on your muddy jeans and immediately eat with your fingers',
        sublabel: 'Wipe off dirt on trousers.',
        isCorrect: false,
        reactionTitle: '🤢 INGESTED FLOOD SEWAGE!',
        reactionMsg: 'Your clothes absorbed flood mud during evacuation! Eating without washing transfers sewage bacteria directly into your mouth!',
        points: 0,
        visualState: 'dirty_hands',
      },
      {
        text: 'Share the same unwashed spoon with five different strangers',
        sublabel: 'Share utensils without cleaning.',
        isCorrect: false,
        reactionTitle: '⚠️ CROSS-CONTAMINATION OUTBREAK!',
        reactionMsg: 'Sharing unwashed utensils in crowded disaster shelters spreads viruses rapidly. Use clean sanitized utensils!',
        points: 0,
        visualState: 'dirty_hands',
      }
    ]
  },
  {
    id: 19,
    badge: '🤝 LEVEL 19: HELPING VULNERABLE NEIGHBOURS',
    title: 'An Elderly Neighbour with a Walking Stick Needs Help!',
    description: 'Water is starting to pool on the road as your street begins evacuation. Mrs. Sharma cannot walk fast alone.',
    situationArt: 'help_neighbours',
    educationalTip: '💡 Community Care: Check on elderly, disabled, and pregnant neighbours during evacuation. A united community survives disasters together.',
    options: [
      {
        text: 'Call your family to assist her and guide her safely to the rescue bus',
        sublabel: 'Carry her small bag and walk together so no one is left behind.',
        isCorrect: true,
        reactionTitle: '💖 TRUE COMMUNITY COMPASSION HERO!',
        reactionMsg: 'Heart of Gold! Disaster resilience is about looking out for one another. Mrs. Sharma safely boarded the relief bus thanks to you!',
        points: 100,
        visualState: 'safe_community_hero',
      },
      {
        text: 'Run past her as fast as you can to get the best seat on the rescue bus',
        sublabel: 'Think only of yourself.',
        isCorrect: false,
        reactionTitle: '❌ LONE WOLF MISTAKE!',
        reactionMsg: 'Disasters test our humanity. Leaving vulnerable elderly neighbours behind puts lives at risk. Always help those in need!',
        points: 0,
        visualState: 'lone_runner',
      },
      {
        text: 'Laugh and tell her to hurry up while running away',
        sublabel: 'Tease someone struggling.',
        isCorrect: false,
        reactionTitle: '😢 UNCARING BEHAVIOR!',
        reactionMsg: 'Disasters require teamwork and kindness. Helping vulnerable citizens is what makes a true disaster hero!',
        points: 0,
        visualState: 'lone_runner',
      },
      {
        text: 'Lock the street exit gate behind you so other people cannot pass',
        sublabel: 'Block the evacuation path for others.',
        isCorrect: false,
        reactionTitle: '⛔ BLOCKED EVACUATION ROUTE!',
        reactionMsg: 'Blocking evacuation pathways traps families in rising water. Keep all emergency evacuation paths open!',
        points: 0,
        visualState: 'lone_runner',
      }
    ]
  },
  {
    id: 20,
    badge: '🛰️ LEVEL 20: OFFICIAL SATELLITE & RADAR WARNINGS',
    title: 'Conflicting Information on WhatsApp vs Official Radar Bulletins!',
    description: 'A viral message claims the flood has cleared, but the NASA/ISRO SAR radar dashboard shows incoming flood crests.',
    situationArt: 'official_radar',
    educationalTip: '💡 Science Over Rumors: Satellite Radar (like NASA-ISRO NISAR) provides unclouded, real-time flood boundary maps. Trust verified scientific platforms!',
    options: [
      {
        text: 'Trust official NASA/ISRO SAR radar maps & certified State Disaster bulletins',
        sublabel: 'Rely on verified NISAR/NASA satellite data and certified meteorological announcements.',
        isCorrect: true,
        reactionTitle: '🏆 MASTER DISASTER GUARDIAN CERTIFIED!',
        reactionMsg: 'PHENOMENAL! Satellite Synthetic Aperture Radar sees through cloud cover and night skies to track real water extents accurately. You made scientifically sound decisions!',
        points: 100,
        visualState: 'safe_radar_hero',
      },
      {
        text: 'Believe unverified forwarded WhatsApp rumors and walk into the flood basin',
        sublabel: 'Trust anonymous social media rumors over scientific data.',
        isCorrect: false,
        reactionTitle: '🛑 MISINFORMATION TRAP!',
        reactionMsg: 'Dangerous! Rumors in disasters cost lives. Always verify flood warnings using official satellite maps and meteorological authorities!',
        points: 0,
        visualState: 'rumor_panic',
      },
      {
        text: 'Flip a coin in the air to decide whether the flood is real or not',
        sublabel: 'Leave life-and-death decisions to random luck.',
        isCorrect: false,
        reactionTitle: '🎲 LIFE IS NOT A GUESSING GAME!',
        reactionMsg: 'Disaster management relies on satellite observations, rainfall gauges, and hydrology models, not luck!',
        points: 0,
        visualState: 'rumor_panic',
      },
      {
        text: 'Assume radar is fake because you looked outside and saw blue sky for 5 minutes',
        sublabel: 'Ignore upstream dam flood waves.',
        isCorrect: false,
        reactionTitle: '⚠️ UPSTREAM DAM FLOOD CRESTS ARE INCOMING!',
        reactionMsg: 'River floods often arrive hours after sunny weather when upstream dams open floodgates! Trust satellite radar tracking!',
        points: 0,
        visualState: 'rumor_panic',
      }
    ]
  }
];

export default function FloodHeroGame() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const scenario = RAW_SCENARIOS[currentScenarioIndex];

  // Randomize the 4 options every time a scenario loads, tries again, or game restarts!
  const randomizedOptions = useMemo(() => {
    return shuffleArray(scenario.options);
  }, [currentScenarioIndex, shuffleKey]);

  function handleSelectOption(opt) {
    setSelectedOption(opt);
    setShowFeedback(true);

    if (opt.isCorrect) {
      if (soundEnabled) playWinSound();
      setScore(s => s + opt.points);
    } else {
      if (soundEnabled) playSplashFailSound();
    }
  }

  function handleNextScenario() {
    setShowFeedback(false);
    setSelectedOption(null);

    if (currentScenarioIndex < RAW_SCENARIOS.length - 1) {
      setCurrentScenarioIndex(idx => idx + 1);
      setShuffleKey(k => k + 1);
      if (soundEnabled) playAlertSound();
    } else {
      setGameOver(true);
      if (soundEnabled) playWinSound();
    }
  }

  function handleTryAgain() {
    setShowFeedback(false);
    setSelectedOption(null);
    // Re-shuffle on try again so answer position changes!
    setShuffleKey(k => k + 1);
  }

  function handleRestartGame() {
    setCurrentScenarioIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setGameOver(false);
    setShuffleKey(k => k + 1);
  }

  const visualState = selectedOption ? selectedOption.visualState : scenario.situationArt;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #111C3A 0%, #0F2B5C 50%, #153E75 100%)',
      borderRadius: '24px',
      border: '2px solid rgba(0, 229, 255, 0.4)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 229, 255, 0.2)',
      padding: '24px',
      color: '#FFFFFF',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Animated Blobs */}
      <div style={{
        position: 'absolute',
        top: '-60px',
        right: '-60px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} className="anim-pulse" />
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        left: '-60px',
        width: '240px',
        height: '240px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} className="anim-pulse" />

      {/* Game Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
        paddingBottom: '16px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(236, 72, 153, 0.4)',
          }} className="anim-float">
            <Trophy size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 800,
                fontFamily: "'Fredoka', sans-serif",
                margin: 0,
                color: '#FFFFFF',
              }}>
                FLOOD HERO: 20-LEVEL GUARDIAN QUEST
              </h2>
              <span style={{
                background: '#FF3366',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}>
                4 CHOICES (RANDOMIZED) 🎲
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#93C5FD' }}>
              4 options per question with randomized answers — test your coastal disaster instincts!
            </div>
          </div>
        </div>

        {/* Score & Sound Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            borderRadius: '12px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Sparkles size={18} color="#FBBF24" />
            <span style={{ fontSize: '13px', color: '#CBD5E1' }}>Score:</span>
            <span style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: '20px',
              fontWeight: 700,
              color: '#FBBF24',
            }}>
              {score} / 2000 XP
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(s => !s)}
            style={{
              background: soundEnabled ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '10px',
              padding: '8px',
              color: soundEnabled ? '#00E5FF' : '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {!gameOver ? (
        <>
          {/* Progress Bar */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 700,
              color: '#93C5FD',
              marginBottom: '6px',
            }}>
              <span style={{ color: '#00E5FF' }}>{scenario.badge}</span>
              <span>Question {currentScenarioIndex + 1} of {RAW_SCENARIOS.length}</span>
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 229, 255, 0.2)',
            }}>
              <div style={{
                height: '100%',
                width: `${((currentScenarioIndex + 1) / RAW_SCENARIOS.length) * 100}%`,
                background: 'linear-gradient(90deg, #00E5FF 0%, #10B981 50%, #FBBF24 100%)',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
                boxShadow: '0 0 10px #00E5FF',
              }} />
            </div>
          </div>

          {/* MAIN TWO-COLUMN GAME CONTAINER */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(320px, 1.35fr)',
            gap: '20px',
            alignItems: 'stretch',
          }}>
            {/* LEFT: THE DYNAMIC REACTIVE VISUALISM ENGINE (ANIMATED SCENE SVG) */}
            <div style={{
              background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
              border: '2px solid rgba(0, 229, 255, 0.35)',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              minHeight: '360px',
              boxShadow: 'inset 0 2px 14px rgba(0,0,0,0.6)',
            }}>
              {/* Scene Atmosphere (Sky, Clouds, Rain, Sun) */}
              <div style={{
                height: '110px',
                position: 'relative',
                background: visualState.includes('safe') || visualState.includes('rescued')
                  ? 'linear-gradient(180deg, #0284C7 0%, #38BDF8 70%, #7DD3FC 100%)'
                  : 'linear-gradient(180deg, #1E293B 0%, #334155 70%, #475569 100%)',
                overflow: 'hidden',
                transition: 'background 0.5s ease',
              }}>
                {visualState.includes('safe') || visualState.includes('rescued') ? (
                  <div style={{ position: 'absolute', top: '15px', right: '25px' }} className="anim-float">
                    <Sun size={48} color="#FBBF24" fill="#FBBF24" />
                  </div>
                ) : (
                  <div style={{ position: 'absolute', top: '15px', right: '25px' }} className="anim-float">
                    <CloudRain size={52} color="#94A3B8" fill="#64748B" />
                  </div>
                )}

                {/* Village Warning Sirens */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0, 0, 0, 0.45)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  color: '#FEF08A',
                  border: '1px solid rgba(254, 240, 138, 0.3)',
                }}>
                  <Megaphone size={14} color="#F59E0B" />
                  <span>COMMUNITY DISASTER DISPATCH</span>
                </div>
              </div>

              {/* Dynamic Village Elements & Objects Canvas (SVG) */}
              <div style={{
                flex: 1,
                position: 'relative',
                background: '#0B1329',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
              }}>
                <svg viewBox="0 0 420 230" style={{ width: '100%', height: '100%', maxHeight: '260px' }}>
                  {/* Sky Defs for Gradients & Glows */}
                  <defs>
                    <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                      <stop offset="25%" stopColor="#F59E0B" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
                      <stop offset="75%" stopColor="#06B6D4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Rainbow Arc (When Safe / Rescued) */}
                  {(visualState.includes('safe') || visualState.includes('rescued')) && (
                    <path
                      d="M 50 160 A 160 160 0 0 1 370 160"
                      fill="none"
                      stroke="url(#rainbowGrad)"
                      strokeWidth="10"
                      className="anim-rainbow"
                    />
                  )}

                  {/* Ground Base */}
                  <path
                    d="M 0 170 Q 150 130 420 160 L 420 230 L 0 230 Z"
                    fill={visualState.includes('safe') ? '#10B981' : '#334155'}
                  />

                  {/* High Ground Hill with Evacuation Watchtower */}
                  <path
                    d="M 270 175 Q 345 85 420 100 L 420 230 L 270 230 Z"
                    fill={visualState.includes('safe') ? '#059669' : '#1E293B'}
                  />

                  {/* OBJECT 1: Evacuation Watchtower on High Ground */}
                  <g transform="translate(365, 45)">
                    {/* Tower Stilts */}
                    <line x1="5" y1="55" x2="12" y2="10" stroke="#78350F" strokeWidth="2.5" />
                    <line x1="30" y1="55" x2="23" y2="10" stroke="#78350F" strokeWidth="2.5" />
                    <line x1="8" y1="35" x2="27" y2="35" stroke="#78350F" strokeWidth="1.5" />
                    <line x1="6" y1="45" x2="29" y2="25" stroke="#78350F" strokeWidth="1.2" />
                    {/* Lookout Platform */}
                    <rect x="8" y="8" width="19" height="10" fill="#92400E" rx="1" />
                    <polygon points="17.5,-2 4,9 31,9" fill="#B45309" />
                    {/* Beacon Light */}
                    <circle cx="17.5" cy="5" r="3.5" fill="#FBBF24" filter="url(#glowEffect)" />
                    {/* Fluttering Green Survival Flag */}
                    <line x1="4" y1="-2" x2="4" y2="10" stroke="#FFFFFF" strokeWidth="1.5" />
                    <polygon points="4,-2 18,2 4,6" fill="#22C55E" className="anim-flag" />
                  </g>

                  {/* OBJECT 2: Utility Power Pole with Sparking Wires */}
                  <g transform="translate(18, 70)">
                    {/* Wooden Pole */}
                    <rect x="5" y="0" width="5" height="110" fill="#475569" rx="1" />
                    <line x1="-8" y1="12" x2="23" y2="12" stroke="#64748B" strokeWidth="2.5" />
                    <circle cx="-6" cy="10" r="2" fill="#94A3B8" />
                    <circle cx="21" cy="10" r="2" fill="#94A3B8" />
                    {/* Drooping Power Lines */}
                    <path d="M 21 12 Q 55 35 75 110" fill="none" stroke="#0F172A" strokeWidth="1.2" />
                    {/* Spark Effects (Electrical Hazard Warning) */}
                    {visualState.includes('sparks') || scenario?.situationArt === 'electrical_box' ? (
                      <g transform="translate(12, 10)" className="anim-spark">
                        <polygon points="0,0 8,-8 4,-1 12,-1 2,10 5,2" fill="#FBBF24" stroke="#00E5FF" strokeWidth="1" filter="url(#glowEffect)" />
                        <circle cx="5" cy="2" r="6" fill="rgba(0, 229, 255, 0.4)" />
                      </g>
                    ) : null}
                  </g>

                  {/* OBJECT 3: Family House */}
                  <g transform="translate(65, 82)">
                    <rect x="0" y="35" width="85" height="55" fill="#F8FAFC" rx="4" />
                    <polygon points="42.5,0 -10,38 95,38" fill="#EF4444" />
                    <rect x="30" y="52" width="25" height="38" fill="#B45309" rx="2" />
                    <rect x="10" y="45" width="18" height="18" fill="#38BDF8" rx="2" />
                    <line x1="19" y1="45" x2="19" y2="63" stroke="#F8FAFC" strokeWidth="2" />
                    <line x1="10" y1="54" x2="28" y2="54" stroke="#F8FAFC" strokeWidth="2" />
                    <rect x="65" y="10" width="12" height="22" fill="#991B1B" />

                    {/* OBJECT 4: Cute Pet Dog on the Dry Rooftop */}
                    <g transform="translate(52, 16)">
                      {/* Dog Body */}
                      <ellipse cx="12" cy="12" rx="7" ry="5" fill="#D97706" />
                      {/* Dog Head */}
                      <circle cx="17" cy="8" r="4.5" fill="#B45309" />
                      {/* Floppy Ear */}
                      <ellipse cx="15" cy="9" rx="2" ry="3.5" fill="#92400E" />
                      {/* Wagging Tail */}
                      <line x1="5" y1="12" x2="2" y2="7" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  </g>

                  {/* OBJECT 5: Sandbags Defense Barrier Wall */}
                  {(visualState.includes('sandbags') || scenario?.title?.toLowerCase().includes('sandbag')) && (
                    <g transform="translate(85, 160)">
                      <rect x="0" y="0" width="22" height="10" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="1" />
                      <rect x="20" y="0" width="22" height="10" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                      <rect x="10" y="-8" width="22" height="10" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                      <text x="21" y="-12" fill="#FBBF24" fontSize="6" textAnchor="middle" fontFamily="Fredoka" fontWeight="bold">BARRIER</text>
                    </g>
                  )}

                  {/* OBJECT 6: TV Set */}
                  <g transform="translate(155, 120)">
                    <rect x="0" y="0" width="34" height="24" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                    {visualState.includes('soaked') || visualState.includes('tv') ? (
                      <>
                        <rect x="3" y="3" width="28" height="18" fill="#3B82F6" opacity="0.8" />
                        <line x1="6" y1="12" x2="26" y2="12" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 2" />
                        <circle cx="17" cy="12" r="3" fill="#FBBF24" />
                      </>
                    ) : (
                      <rect x="3" y="3" width="28" height="18" fill="#1E293B" />
                    )}
                    <rect x="14" y="24" width="6" height="5" fill="#64748B" />
                    <rect x="9" y="29" width="16" height="3" fill="#475569" rx="1" />
                    <text x="17" y="38" fill="#93C5FD" fontSize="6" textAnchor="middle" fontFamily="Fredoka">TV</text>
                  </g>

                  {/* OBJECT 7: Drinking Watercan (Jerrycan with Water Level) */}
                  <g transform="translate(195, 120)">
                    <rect x="0" y="8" width="22" height="26" rx="4" fill="#06B6D4" stroke="#00E5FF" strokeWidth="1.5" />
                    <rect x="2" y="14" width="18" height="18" rx="2" fill="#38BDF8" />
                    {/* Water Level Slosh */}
                    <path d="M 2 22 Q 11 20 20 22 L 20 32 L 2 32 Z" fill="#0284C7" />
                    <rect x="6" y="3" width="10" height="6" fill="#0284C7" rx="1" />
                    <path d="M 0 12 C -6 12 -6 24 0 24" fill="none" stroke="#00E5FF" strokeWidth="2.5" />
                    <circle cx="11" cy="23" r="3" fill="#A5F3FC" opacity="0.7" />
                    <text x="11" y="42" fill="#00E5FF" fontSize="6" textAnchor="middle" fontFamily="Fredoka" fontWeight="bold">WATERCAN</text>
                  </g>

                  {/* OBJECT 8: Emergency First Aid Kit & Radio */}
                  <g transform="translate(230, 122)">
                    {/* Red Cross First Aid Box */}
                    <rect x="0" y="8" width="20" height="16" rx="3" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                    <rect x="7" y="3" width="6" height="5" fill="#DC2626" rx="1" />
                    <rect x="8" y="12" width="4" height="8" fill="#FFFFFF" />
                    <rect x="6" y="14" width="8" height="4" fill="#FFFFFF" />
                    {/* Walkie-Talkie / Emergency Radio */}
                    <rect x="24" y="6" width="12" height="18" rx="2" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
                    <line x1="26" y1="6" x2="26" y2="-4" stroke="#94A3B8" strokeWidth="1.5" />
                    <circle cx="30" cy="11" r="2" fill="#38BDF8" />
                    {/* Radio Signal Broadcast Waves */}
                    <path d="M 27 -6 Q 30 -10 33 -6" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.8" />
                    <text x="17" y="32" fill="#F87171" fontSize="6" textAnchor="middle" fontFamily="Fredoka" fontWeight="bold">AID & RADIO</text>
                  </g>

                  {/* OBJECT 9: Lifebuoy Safety Ring */}
                  <g transform="translate(275, 125)">
                    <circle cx="11" cy="11" r="10" fill="none" stroke="#F97316" strokeWidth="6" />
                    <circle cx="11" cy="11" r="10" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeDasharray="5 10" />
                    <circle cx="11" cy="11" r="5" fill="#0B1329" />
                    <text x="11" y="28" fill="#FB923C" fontSize="6" textAnchor="middle" fontFamily="Fredoka" fontWeight="bold">LIFEBUOY</text>
                  </g>

                  {/* OBJECT 10: Inflatable Rescue Boat / Raft on the Water */}
                  {(visualState.includes('rescued') || visualState.includes('boat') || scenario?.title?.toLowerCase().includes('boat') || scenario?.title?.toLowerCase().includes('raft')) && (
                    <g transform="translate(130, 162)">
                      {/* Inflatable Boat Hull */}
                      <ellipse cx="28" cy="12" rx="26" ry="9" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
                      <ellipse cx="28" cy="10" rx="20" ry="6" fill="#047857" />
                      {/* Oar / Paddle */}
                      <line x1="12" y1="0" x2="35" y2="20" stroke="#78350F" strokeWidth="2" />
                      <ellipse cx="37" cy="21" rx="4" ry="2" fill="#92400E" />
                      {/* Life Ring on Boat Bow */}
                      <circle cx="8" cy="12" r="3" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                      <text x="28" y="27" fill="#FDE68A" fontSize="6" textAnchor="middle" fontFamily="Fredoka" fontWeight="bold">RESCUE RAFT</text>
                    </g>
                  )}

                  {/* OBJECT 11: Coast Guard Rescue Helicopter in Sky */}
                  {(visualState.includes('safe') || visualState.includes('rescued') || scenario?.situationArt === 'cyclone_shelter') && (
                    <g transform="translate(170, 18)" className="anim-float">
                      {/* Helicopter Fuselage */}
                      <ellipse cx="28" cy="14" rx="20" ry="10" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
                      {/* Cockpit Window */}
                      <path d="M 38 10 Q 46 14 38 18 Z" fill="#38BDF8" opacity="0.85" />
                      {/* Tail Boom & Rotor */}
                      <rect x="0" y="12" width="16" height="4" fill="#DC2626" />
                      <line x1="2" y1="6" x2="2" y2="20" stroke="#FFFFFF" strokeWidth="1.5" />
                      {/* Rotor Mast & Spinning Main Blades */}
                      <rect x="26" y="2" width="4" height="4" fill="#475569" />
                      <line x1="6" y1="2" x2="50" y2="2" stroke="#FFFFFF" strokeWidth="2.5" className="anim-rotor" />
                      {/* Rescue Cross Symbol */}
                      <rect x="23" y="11" width="6" height="2" fill="#FFFFFF" />
                      <rect x="25" y="9" width="2" height="6" fill="#FFFFFF" />
                      {/* Spotlight Light Beam */}
                      <polygon points="34,18 20,70 65,70" fill="url(#beamGrad)" className="anim-beam" />
                    </g>
                  )}

                  {/* OBJECT 12: High-Power Flashlight Beam (Night & Storm Visibility) */}
                  {(scenario?.title?.toLowerCase().includes('night') || scenario?.title?.toLowerCase().includes('dark') || scenario?.title?.toLowerCase().includes('torch')) && (
                    <g transform="translate(290, 130)">
                      <rect x="0" y="0" width="14" height="6" rx="2" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
                      <polygon points="14,0 70,-15 70,25 14,6" fill="url(#beamGrad)" className="anim-beam" />
                    </g>
                  )}

                  {/* Character on High Ground / In Action */}
                  {visualState.includes('safe') || visualState.includes('drinking') || visualState.includes('sandbags') || visualState.includes('shelter') || visualState.includes('rescued') ? (
                    <g transform="translate(325, 88)">
                      <rect x="10" y="24" width="18" height="26" rx="5" fill="#F97316" stroke="#FEF08A" strokeWidth="1.5" />
                      <circle cx="19" cy="14" r="11" fill="#FED7AA" />
                      <circle cx="15" cy="13" r="1.5" fill="#1E293B" />
                      <circle cx="23" cy="13" r="1.5" fill="#1E293B" />
                      <path d="M 15 18 Q 19 22 23 18" fill="none" stroke="#1E293B" strokeWidth="1.5" />
                      <line x1="10" y1="28" x2="0" y2="18" stroke="#FED7AA" strokeWidth="3" strokeLinecap="round" />
                      <line x1="28" y1="28" x2="38" y2="18" stroke="#FED7AA" strokeWidth="3" strokeLinecap="round" />
                      <line x1="14" y1="50" x2="14" y2="64" stroke="#1E3A8A" strokeWidth="3.5" strokeLinecap="round" />
                      <line x1="24" y1="50" x2="24" y2="64" stroke="#1E3A8A" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="19" cy="32" r="3" fill="#FBBF24" />
                      <text x="19" y="74" fill="#34D399" fontSize="7" textAnchor="middle" fontFamily="Fredoka" fontWeight="bold">SAFE HERO!</text>
                    </g>
                  ) : (
                    <g transform="translate(115, 130)">
                      <circle cx="16" cy="12" r="10" fill="#FED7AA" />
                      <circle cx="13" cy="11" r="1.5" fill="#1E293B" />
                      <circle cx="19" cy="11" r="1.5" fill="#1E293B" />
                      <path d="M 13 18 Q 16 15 19 18" fill="none" stroke="#1E293B" strokeWidth="1.5" />
                      <rect x="8" y="22" width="16" height="22" rx="4" fill="#3B82F6" />
                      <line x1="10" y1="44" x2="8" y2="56" stroke="#1E3A8A" strokeWidth="3" />
                      <line x1="22" y1="44" x2="24" y2="56" stroke="#1E3A8A" strokeWidth="3" />
                    </g>
                  )}

                  {/* Rising/Lowering Floodwater Line */}
                  <path
                    d={visualState.includes('safe')
                      ? "M 0 210 Q 105 205 210 210 T 420 210 L 420 230 L 0 230 Z"
                      : "M 0 162 Q 105 154 210 162 T 420 158 L 420 230 L 0 230 Z"
                    }
                    fill={visualState.includes('safe') ? 'rgba(56, 189, 248, 0.45)' : 'rgba(180, 83, 9, 0.78)'}
                    className="water-wave"
                  />
                  <path
                    d={visualState.includes('safe')
                      ? "M 0 215 Q 125 211 250 215 T 420 212 L 420 230 L 0 230 Z"
                      : "M 0 170 Q 125 162 250 170 T 420 166 L 420 230 L 0 230 Z"
                    }
                    fill={visualState.includes('safe') ? 'rgba(2, 132, 199, 0.65)' : 'rgba(146, 64, 14, 0.88)'}
                  />
                </svg>
              </div>

              {/* Real-Time Reactive Visual Caption */}
              <div style={{
                padding: '10px 16px',
                background: 'rgba(15, 23, 42, 0.95)',
                borderTop: '1px solid rgba(0, 229, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                  SCENARIO GRAPHICS ENGINE
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: visualState.includes('safe') ? '#34D399' : '#FBBF24',
                }}>
                  {visualState.includes('safe') ? '✅ HIGH GROUND SAFE' : '⚠️ FLOOD THREAT ACTIVE'}
                </span>
              </div>
            </div>

            {/* RIGHT: 4 RANDOMIZED CHOICES & DECISION PANEL */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '2px solid rgba(0, 229, 255, 0.25)',
              borderRadius: '20px',
              padding: '20px',
            }}>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 6px 0',
                  lineHeight: 1.3,
                }}>
                  {scenario.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#CBD5E1',
                  margin: '0 0 14px 0',
                  lineHeight: 1.4,
                }}>
                  {scenario.description}
                </p>

                {/* 4 Randomized Option Buttons: A, B, C, D */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {randomizedOptions.map((opt, index) => {
                    const optionLetter = ['A', 'B', 'C', 'D'][index];
                    const isPicked = selectedOption?.text === opt.text;
                    const showResult = showFeedback && isPicked;

                    let bg = 'rgba(30, 41, 59, 0.85)';
                    let border = '1px solid rgba(255, 255, 255, 0.15)';
                    if (showResult) {
                      bg = opt.isCorrect
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.4) 100%)'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(185, 28, 28, 0.4) 100%)';
                      border = opt.isCorrect ? '2px solid #10B981' : '2px solid #EF4444';
                    }

                    return (
                      <button
                        key={`${scenario.id}-${index}-${opt.text.slice(0, 10)}`}
                        disabled={showFeedback}
                        onClick={() => handleSelectOption(opt)}
                        style={{
                          background: bg,
                          border: border,
                          borderRadius: '14px',
                          padding: '12px 14px',
                          textAlign: 'left',
                          cursor: showFeedback ? 'default' : 'pointer',
                          color: '#FFFFFF',
                          transition: 'all 0.18s ease',
                          boxShadow: isPicked ? '0 8px 20px rgba(0, 0, 0, 0.4)' : 'none',
                        }}
                        className={!showFeedback ? 'card-colorful' : ''}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '3px',
                        }}>
                          <span style={{
                            fontFamily: "'Fredoka', sans-serif",
                            fontSize: '13px',
                            fontWeight: 700,
                            color: showResult ? (opt.isCorrect ? '#34D399' : '#F87171') : '#00E5FF',
                          }}>
                            {optionLetter}) {opt.text}
                          </span>
                          {showResult && (
                            opt.isCorrect ? <CheckCircle2 size={16} color="#10B981" /> : <AlertTriangle size={16} color="#EF4444" />
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                          {opt.sublabel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Alert & Next Button */}
              {showFeedback && (
                <div style={{
                  marginTop: '14px',
                  background: selectedOption.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: selectedOption.isCorrect ? '1px solid #10B981' : '1px solid #EF4444',
                  borderRadius: '14px',
                  padding: '12px',
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: selectedOption.isCorrect ? '#34D399' : '#F87171',
                    marginBottom: '3px',
                  }}>
                    {selectedOption.reactionTitle}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E2E8F0', marginBottom: '10px', lineHeight: 1.4 }}>
                    {selectedOption.reactionMsg}
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#FEF08A',
                    marginBottom: '10px',
                  }}>
                    {scenario.educationalTip}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!selectedOption.isCorrect ? (
                      <button
                        onClick={handleTryAgain}
                        style={{
                          flex: 1,
                          background: 'rgba(239, 68, 68, 0.3)',
                          border: '1px solid #EF4444',
                          color: '#FFFFFF',
                          padding: '10px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <RefreshCw size={14} />
                        <span>Try Again (Shuffle 🎲)</span>
                      </button>
                    ) : null}

                    <button
                      onClick={handleNextScenario}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #00E5FF, #3B82F6)',
                        border: 'none',
                        color: '#080D1A',
                        padding: '10px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(0, 229, 255, 0.4)',
                      }}
                    >
                      <span>{currentScenarioIndex < RAW_SCENARIOS.length - 1 ? 'Next Level ➔' : 'Complete Quest 🏆'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* VICTORY CELEBRATION CERTIFICATE SCREEN (20/20 COMPLETED) */
        <div style={{
          textAlign: 'center',
          padding: '36px 20px',
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderRadius: '20px',
          border: '2px solid #10B981',
          position: 'relative',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)',
            marginBottom: '16px',
          }} className="anim-float">
            <Award size={48} color="#FFFFFF" />
          </div>

          <h2 style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: '32px',
            color: '#FBBF24',
            margin: '0 0 6px 0',
          }}>
            QUEST COMPLETE!
          </h2>

          <h3 style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 12px 0',
          }}>
            Official Junior Disaster Guardian Certification
          </h3>

          <p style={{
            fontSize: '14px',
            color: '#93C5FD',
            maxWidth: '540px',
            margin: '0 auto 24px auto',
            lineHeight: 1.5,
          }}>
            Congratulations! You completed all 20 life-saving flood and coastal disaster prevention challenges with 4 randomized options per level, scoring <strong style={{ color: '#FBBF24' }}>{score} / 2000 XP</strong>.
          </p>

          <div style={{ display: 'inline-flex', gap: '12px' }}>
            <button
              onClick={handleRestartGame}
              style={{
                background: 'linear-gradient(135deg, #00E5FF, #3B82F6)',
                border: 'none',
                color: '#080D1A',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(0, 229, 255, 0.4)',
              }}
            >
              <RefreshCw size={16} />
              <span>Play Again (Randomized Shuffled Order)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
