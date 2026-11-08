import type { Locator } from '@playwright/test'

import { expect, test } from '../../../utils/fixtures'

const attribute2Color = (color: string | null): string => `
  sections:
    forecast_strip:
      weather_icon_type: line
      attribute_3: precipitation_probability
${color === null ? '' : `      attribute_3_color: "${color}"`}
`

const firstSecondColor = (clockWeatherCard: Locator): Promise<string> =>
  clockWeatherCard.locator('clock-weather-card-forecast-strip-item .attribute--third')
    .first()
    .evaluate(el => getComputedStyle(el).color)

test.describe('sections.forecast_strip.attribute_3_color', () => {
  test('colors the third attribute row', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: attribute2Color('#ff0000') })

    expect(await firstSecondColor(clockWeatherCard))
      .toBe('rgb(255, 0, 0)')
  })

  test('inherits the color of the first row by default', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: attribute2Color(null) })

    expect(await firstSecondColor(clockWeatherCard))
      .toBe('rgb(57, 136, 239)')
  })

  test('swaps the color at runtime when the config changes (no reload)', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: attribute2Color('#ff0000') })
    expect(await firstSecondColor(clockWeatherCard))
      .toBe('rgb(255, 0, 0)')

    await setupCard({ cardConfig: attribute2Color(null) })

    expect(await firstSecondColor(clockWeatherCard)).not.toBe('rgb(255, 0, 0)')
  })

  test('rejects an empty color', async ({ setupCard, cardErrorMessage }) => {
    await setupCard({ cardConfig: attribute2Color('') })

    await cardErrorMessage()
      .toContain('Config option "sections.forecast_strip.attribute_3_color" has invalid value "", expected a non-empty string')
  })
})
