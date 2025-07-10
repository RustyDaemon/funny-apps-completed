export interface ParsedCommand {
	command: string;
	args: string[];
	flags: Record<string, string | boolean>;
	rawInput: string;
}

export const parseCommand = (input: string): ParsedCommand => {
	const trimmed = input.trim();
	const parts = trimmed.split(/\s+/);
	const command = parts[0] || '';
	const rest = parts.slice(1);

	const args: string[] = [];
	const flags: Record<string, string | boolean> = {};

	for (let i = 0; i < rest.length; i++) {
		const part = rest[i];

		if (part.startsWith('--')) {
			const flagName = part.slice(2);
			const nextPart = rest[i + 1];

			if (nextPart && !nextPart.startsWith('--') && !nextPart.startsWith('-')) {
				flags[flagName] = nextPart;
				i++; // Skip next part as it's the flag value
			} else {
				flags[flagName] = true;
			}
		} else if (part.startsWith('-')) {
			const flagName = part.slice(1);
			flags[flagName] = true;
		} else {
			args.push(part);
		}
	}

	return {
		command,
		args,
		flags,
		rawInput: trimmed,
	};
};

export const autoComplete = (input: string, commands: string[]): string => {
	const trimmed = input.trim();
	if (!trimmed) return input;

	const parts = trimmed.split(/\s+/);
	const lastPart = parts[parts.length - 1];

	// Only autocomplete if we're completing the first word (command name)
	if (parts.length === 1) {
		const matches = commands.filter(cmd =>
			cmd.startsWith(lastPart.toLowerCase())
		);
		if (matches.length === 1) {
			return matches[0];
		}
	}

	return input;
};
