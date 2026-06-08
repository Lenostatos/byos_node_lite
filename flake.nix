{
  description = "Node.js / TypeScript dev environment";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    {
      flake-parts,
      nixpkgs,
      ...
    }@inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        # To import an internal flake module: ./other.nix
        # To import an external flake module:
        #   1. Add foo to inputs
        #   2. Add foo as a parameter to the outputs function
        #   3. Add here: foo.flakeModule

      ];

      # Declared systems that your flake supports. These will be enumerated in perSystem
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];

      perSystem =
        {
          lib,
          config,
          self',
          inputs',
          pkgs,
          system,
          ...
        }:
        {
          # Per-system attributes can be defined here. The self' and inputs'
          # module parameters provide easy access to attributes of the same
          # system.
          #
          # Allows definition of system-specific attributes
          # without needing to declare the system explicitly!
          #
          # Quick rundown of the provided arguments:
          # - config is a reference to the full configuration, lazily evaluated
          # - self' is the outputs as provided here, without system. (self'.packages.default)
          # - inputs' is the input without needing to specify system (inputs'.foo.packages.bar)
          # - pkgs is an instance of nixpkgs for your specific system
          # - system is the system this configuration is for

          # Equivalent to packages.<system>.default = inputs'.nixpkgs.legacyPackages.hello;
          # packages.default = pkgs.hello;
          devShells.default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs_24
              chromium
            ];

            shellHook = ''
              export BYOS_ENABLED=true
              export PUPPETEER_SKIP_DOWNLOAD=1
              export PUPPETEER_EXECUTABLE_PATH=${lib.getExe pkgs.chromium}
              echo "🟢 node $(node --version)"
            '';
          };
        };

      flake = {
        # The usual flake attributes can be defined here, including system-
        # agnostic ones like nixosModule and system-enumerating ones, although
        # those are more easily expressed in perSystem.
      };
    };
}
