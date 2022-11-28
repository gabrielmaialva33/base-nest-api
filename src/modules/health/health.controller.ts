import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'base_api_ping',
          'https://base-os-api.azurewebsites.net',
        ),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () =>
        this.diskHealthIndicator.checkStorage('disk_health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
      () =>
        this.http.responseCheck(
          'base_api_response',
          'https://base-os-api.azurewebsites.net/hello',
          (res) => res.status === 200,
        ),
    ]);
  }
}
