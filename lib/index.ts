import { FilterPattern, ResolvedConfig, createFilter } from "vite"
import { transform as SWCTransform, Options as SWCOption } from "@swc/core"

interface Options extends Omit<SWCOption, "filename" | "sourceFileName"> {
  include?: FilterPattern
}

export const swc = (
  options: Options = {
    include: /\.ts?$/,
    exclude: "node_modules",
    minify: true,
    jsc: {
      parser: {
        syntax: "typescript",
        decorators: true,
      },
      transform: {
        decoratorMetadata: true,
        decoratorVersion: "2022-03",
      },
    },
  },
) => {
  let _config: ResolvedConfig
  const { include, ...swcOptions } = options
  const filter = createFilter(options.include, options.exclude)
  return {
    name: "vite-plugin-swc",
    enforce: "pre" as any,
    config() {
      return {
        esbuild: false,
      } as any
    },
    configResolved(resolvedConfig: ResolvedConfig) {
      _config = resolvedConfig
    },
    transform(code: string, id: string) {
      if (filter(id)) {
        return SWCTransform(code, {
          filename: id,
          sourceFileName: id.split("?", 1)[0],
          ...swcOptions,
        })
      }
    },
  }
}