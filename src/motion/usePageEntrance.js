import { createContext } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const MaskEpoch = createContext(() => {})

const PANEL = '.dashboard-preview, .glass-card, .price-card, .journey-panel, .summary-panel, .hero-globe'

function containedBy(node, selector) {
  return Boolean(node.parentElement?.closest(selector))
}

function collectLoose(section) {
  return [...section.querySelectorAll('p, a.button, a.button-ghost, a.button-gold, button.button, button.button-ghost, button.button-gold, .journey-step, .logo-row span, .area-list > details, .filters, .hero-paths button, .path-switch button, .preview-banner')]
    .filter((node) => {
      if (node.matches('[data-cursor="action"]')) return false
      if (containedBy(node, '.contact-form, .menu-list, .op-list, details, .filters, .offer-card')) return false
      if (containedBy(node, PANEL)) return false
      return true
    })
}

function panelPieces(panel) {
  return [...panel.querySelectorAll(':scope > p, :scope > .fine, :scope .deliverable-list > li, :scope > .dashboard-bar, :scope .contact-panel > *, :scope .check-list > li, :scope > a, :scope > .hero-actions')]
    .filter((node) => !node.closest('h1, h2, h3') && !node.matches('h1, h2, h3'))
}

function addRise(timeline, nodes, position, { y, duration, stagger = 0.1 }) {
  if (!nodes.length) return
  timeline.from(nodes, {
    y,
    opacity: 0,
    duration,
    stagger: nodes.length > 10 ? { each: 0.06 } : stagger,
    immediateRender: true,
    clearProps: 'transform,opacity',
  }, position)
}

function animateSection(section, index, mobile) {
  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      once: true,
      refreshPriority: index,
    },
  })
  const headingY = mobile ? 28 : 50
  const copyY = mobile ? 18 : 32
  const panelY = mobile ? 24 : 52
  const duration = mobile ? 0.65 : 0.9
  const headings = [...section.querySelectorAll('h1, h2, h3')]
    .filter((heading) => !heading.closest('.op-list'))
    .flatMap((heading) => {
      const lines = [...heading.querySelectorAll('.mask-line-inner')]
      return lines.length ? lines : [heading]
    })
  addRise(timeline, headings, 0, { y: headingY, duration, stagger: 0.1 })

  const cta = section.querySelector('.cta-band')
  if (cta) {
    const sentence = cta.querySelector('.fine')
    const action = [...cta.querySelectorAll('a, button')].filter((node) => !node.closest('.dashboard-preview'))
    const panel = cta.querySelector('.dashboard-preview')
    if (sentence) addRise(timeline, [sentence], 0.18, { y: copyY, duration: duration * 0.85 })
    if (action.length) {
      const magnetic = action.filter((node) => node.matches('[data-cursor="action"]'))
      const plain = action.filter((node) => !node.matches('[data-cursor="action"]'))
      addRise(timeline, plain, 0.28, { y: copyY, duration: 0.75, stagger: 0.1 })
      if (magnetic.length) {
        timeline.from(magnetic, { opacity: 0, duration: 0.75, stagger: 0.1, clearProps: 'opacity' }, 0.28)
      }
    }
    if (panel) {
      timeline.from(panel, {
        y: panelY,
        scale: mobile ? 0.98 : 0.96,
        opacity: 0,
        duration: mobile ? 0.7 : 1,
        immediateRender: true,
        clearProps: 'transform,opacity',
      }, 0.22)
      addRise(timeline, panelPieces(panel), 0.4, { y: mobile ? 14 : 22, duration: 0.7, stagger: 0.1 })
    }
    return timeline
  }

  addRise(timeline, collectLoose(section), 0.12, { y: copyY, duration: mobile ? 0.6 : 0.8, stagger: 0.1 })
  const magnetic = [...section.querySelectorAll('[data-cursor="action"]')].filter((node) => !node.closest('.contact-form, .cta-band'))
  if (magnetic.length) {
    timeline.from(magnetic, { opacity: 0, duration: 0.7, stagger: 0.1, clearProps: 'opacity' }, 0.16)
  }

  const panels = [...section.querySelectorAll(PANEL)].filter((node) => !node.closest('.op-list, .cta-band'))
  if (panels.length) {
    timeline.from(panels, {
      y: panelY,
      scale: mobile ? 0.98 : 0.96,
      opacity: 0,
      duration: mobile ? 0.7 : 0.95,
      stagger: 0.1,
      immediateRender: true,
      clearProps: 'transform,opacity',
    }, 0.08)
    panels.forEach((panel, panelIndex) => {
      addRise(timeline, panelPieces(panel), 0.24 + panelIndex * 0.06, { y: mobile ? 12 : 20, duration: 0.7, stagger: 0.08 })
    })
  }

  const catalog = section.querySelector('.op-list')
  if (catalog) {
    timeline.from(catalog, {
      y: panelY,
      opacity: 0,
      duration: mobile ? 0.65 : 0.85,
      immediateRender: true,
      clearProps: 'transform,opacity',
    }, 0.16)
  }

  const form = section.querySelector('.contact-form')
  if (form) timeline.from(form, { opacity: 0, duration: 0.8, clearProps: 'opacity' }, 0.2)
  return timeline
}

function setup(root, mobile) {
  const sections = [...root.querySelectorAll('section')]
  const timelines = sections.map((section, index) => animateSection(section, index, mobile))

  const line = root.querySelector('.journey-line')
  const journey = line?.closest('section')
  let progress
  if (line && journey && !mobile) {
    const steps = [...journey.querySelectorAll('.journey-step')]
    gsap.set(line, { clearProps: 'transform' })
    progress = ScrollTrigger.create({
      trigger: journey,
      start: 'top 75%',
      end: 'bottom 60%',
      scrub: 0.45,
      onUpdate: (self) => {
        const current = Math.max(0, Math.ceil(self.progress * steps.length) - 1)
        steps.forEach((step, index) => step.classList.toggle('is-progress', index <= current && self.progress > 0.04))
      },
    })
  }

  if (!mobile) {
    const glow = root.querySelector('.hero-glow')
    if (glow) {
      timelines.push(gsap.to(glow, {
        y: 22,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-saas', start: 'top top', end: 'bottom top', scrub: 0.5 },
      }))
    }
    root.querySelectorAll('.ring-visual').forEach((ring) => {
      timelines.push(gsap.to(ring, {
        y: -28,
        ease: 'none',
        scrollTrigger: { trigger: ring, start: 'top bottom', end: 'bottom top', scrub: 0.55 },
      }))
    })
  }

  return () => {
    progress?.kill()
    root.querySelectorAll('.journey-step.is-progress').forEach((node) => node.classList.remove('is-progress'))
    timelines.forEach((tween) => tween.kill())
  }
}

export function usePageEntrance(scopeRef, dependencies = []) {
  useGSAP((_, contextSafe) => {
    const root = scopeRef.current
    if (!root) return undefined
    let mm
    const mount = contextSafe(() => {
      mm?.revert()
      mm = gsap.matchMedia()
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          mobile: '(max-width: 959px)',
          desktop: '(min-width: 960px)',
        },
        (context) => {
          if (context.conditions.reduce) return undefined
          try {
            return setup(root, Boolean(context.conditions.mobile))
          } catch {
            gsap.set(root.querySelectorAll('.mask-line-inner, p, a, button, article, .dashboard-preview, .glass-card, .filters, .contact-form'), {
              clearProps: 'all',
            })
            return undefined
          }
        },
      )
      ScrollTrigger.refresh()
    })
    mount()
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      mm?.revert()
    }
  }, { scope: scopeRef, dependencies, revertOnUpdate: true })
}
