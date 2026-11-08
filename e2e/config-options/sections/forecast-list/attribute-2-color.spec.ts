import type { Locator } from '@playwright/test'

import { expect, test } from '../../../utils/fixtures'
import { dailyForecast, DEFAULT_DATE } from '../../../utils/test-utils'

const colorConfig = (color: string | null): string => `
  sections:
    forecast_list:
      forecast_type: daily
      attribute_2: uv_index
${color === null ? '' : `      attribute_2_color: "${color}"`}
`

const forecast_daily = dailyForecast(DEFAULT_DATE, ['sunny', 'cloudy'], i => ({ templow: 10, temperature: 20, uv_index: [3, 5][i] }))

const firstColor = (clockWeatherCard: Locator): Promise<string> =>
  clockWeatherCard.locator('clock-weather-card-forecast-list-item .attribute-2')
    .first()
    .evaluate(el => getComputedStyle(el).color)

test.describe('sections.forecast_list.attribute_2_color', () => {
  test('colors the values', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: colorConfig('#ff0000'), weather: { forecast_daily } })

    expect(await firstColor(clockWeatherCard))
      .toBe('rgb(255, 0, 0)')
  })

  test('swaps the color at runtime when the config changes (no reload)', async ({ setupCard, clockWeatherCard }) => {
    await setupCard({ cardConfig: colorConfig('#ff0000'), weather: { forecast_daily } })
    expect(await firstColor(clockWeatherCard))
      .toBe('rgb(255, 0, 0)')

    await setupCard({ cardConfig: colorConfig(null), weather: { forecast_daily } })

    expect(await firstColor(clockWeatherCard)).not.toBe('rgb(255, 0, 0)')
  })

  test('rejects an empty color', async ({ setupCard, cardErrorMessage }) => {
    await setupCard({ cardConfig: colorConfig('') })

    await cardErrorMessage()
      .toContain('Config option "sections.forecast_list.attribute_2_color" has invalid value "", expected a non-empty string')
  })
})
