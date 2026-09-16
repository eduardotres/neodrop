# Prices for Jóia Branca and Jóia Amarela

**Date:** 2026-09-16

## What changed

`PRICES` in `src/lib/prices.ts` gained Jóia Branca Enfraquecida at 280kk and Jóia
Amarela Enfraquecida at 40kk.

## Why

Values given by the author.

## Notes

Priced so far: Branca 280kk, Violeta 180kk, Azul 120kk, Verde 80kk, Amarela 40kk.
Still unpriced: Vermelha, Laranja, Negra.

Amarela was the most-dropped jewel in the author's log and was being left out of the
period total, so this is the one that moves the number most.

The `jewelDrops` tests used Amarela as their unpriced jewel and broke once it got a
price. They now use a made-up "Jóia Sem Preço (teste)", which no real price will ever
match.
