import '@/components/clock-weather-card-icon'

import type { TemplateResult } from 'lit'
import { html, nothing } from 'lit'
import { property } from 'lit/decorators.js'

import AbstractClockWeatherCardComponent from '@/components/abstract-clock-weather-card-components'
import type { ForecastStripAttribute, ForecastStripItem } from '@/types'
import { customElement } from '@/utils/custom-element'
import { MISSING_VALUE } from '@/utils/forecast-attributes'

@customElement('clock-weather-card-forecast-strip-item')
class ClockWeatherCardForecastStripItem extends AbstractClockWeatherCardComponent {
  @property({ attribute: false }) public item!: ForecastStripItem

  public render(): TemplateResult {
    const { label, condition, isNight, animatedIcon, weatherIconType, temperature, temperatureLow, temperatureUnit, sunEvent, attribute, attribute2, attribute3 } = this.item
    const attributeClass = weatherIconType === 'monochrome' ? 'attribute attribute--monochrome' : 'attribute'
    const renderAttribute = (a: ForecastStripAttribute | null, extraClass = ''): TemplateResult | typeof nothing => a
      ? html`<span class=${`${attributeClass}${extraClass}`} style=${a.color ? `color: ${a.color}` : nothing}>${a.value !== null ? html`${a.icon ? html`<ha-icon icon=${a.icon}></ha-icon>` : nothing}<span class="attribute-value">${a.value}</span>` : nothing}</span>`
      : nothing

    return html`
      <span class="time" title=${label}>${label}</span>
      <clock-weather-card-icon
        .weatherState=${condition}
        .isNight=${isNight}
        .animatedIcon=${animatedIcon}
        .weatherIconType=${weatherIconType}
      ></clock-weather-card-icon>
      ${sunEvent
    ? html`<span class="label"><ha-icon icon=${sunEvent.kind === 'sunrise' ? 'mdi:arrow-up' : 'mdi:arrow-down'} title=${sunEvent.label} aria-label=${sunEvent.label}></ha-icon></span>`
    : html`<span class="label">${temperature === null ? MISSING_VALUE : `${temperature}${temperatureUnit}`}</span>`}
      ${temperatureLow === null || temperatureLow === undefined ? nothing : html`<span class="temperature-low">${temperatureLow}${temperatureUnit}</span>`}
      ${renderAttribute(attribute)}
      ${renderAttribute(attribute2, ' attribute--second')}
      ${renderAttribute(attribute3, ' attribute--third')}
    `
  }
}

export default ClockWeatherCardForecastStripItem
